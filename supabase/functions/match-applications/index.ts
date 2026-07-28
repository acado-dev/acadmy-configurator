import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const SYSTEM_PROMPT = `You are an admissions screening agent.
You help an admissions officer filter a list of applications and decide next actions.

You receive:
- the evaluation rubric (criteria) configured for the course, if any
- a compact JSON list of applications (id, name, course, matchScore, status, key form data)
- the officer's plain-English instruction

Return ONLY JSON matching the schema.
- "matchedIds": ids of the applications that satisfy the instruction, best first. Empty array if none.
- "reply": 1-3 short sentences explaining what you filtered on and what you found.
- "reasons": one entry per matched application explaining briefly why it matched (and mention its score).
- "suggestedAction": one of "shortlist", "document_review", "communicate", "interview", "reject", "none" — the action you recommend for the matched set.
- "actionRationale": why that action.
- Never invent application ids. Only use ids present in the provided list.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const instruction = typeof body.instruction === 'string' ? body.instruction.trim().slice(0, 4000) : '';
    const applications = Array.isArray(body.applications) ? body.applications.slice(0, 300) : [];
    const criteria = Array.isArray(body.criteria) ? body.criteria.slice(0, 100) : [];
    const context = typeof body.context === 'string' ? body.context.slice(0, 500) : '';

    if (!instruction) {
      return new Response(JSON.stringify({ error: 'Please describe how you want to filter the applications.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!applications.length) {
      return new Response(JSON.stringify({ error: 'There are no applications to evaluate.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userContent = [
      context ? `Context: ${context}` : '',
      criteria.length ? `Evaluation rubric (JSON): ${JSON.stringify(criteria)}` : 'No rubric configured — rely on match scores and form data.',
      `Applications (JSON): ${JSON.stringify(applications)}`,
      `Officer instruction:\n"""${instruction}"""`,
    ].filter(Boolean).join('\n\n');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.6-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'application_filter',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                matchedIds: { type: 'array', items: { type: 'string' } },
                reply: { type: 'string' },
                suggestedAction: {
                  type: 'string',
                  enum: ['shortlist', 'document_review', 'communicate', 'interview', 'reject', 'none'],
                },
                actionRationale: { type: 'string' },
                reasons: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      id: { type: 'string' },
                      reason: { type: 'string' },
                    },
                    required: ['id', 'reason'],
                  },
                },
              },
              required: ['matchedIds', 'reply', 'suggestedAction', 'actionRationale', 'reasons'],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error(`AI gateway error [${response.status}]: ${details}`);
      const message =
        response.status === 429
          ? 'Rate limit reached. Please try again in a moment.'
          : response.status === 402
            ? 'AI credits exhausted. Please add credits to continue.'
            : 'The AI service could not process this request.';
      return new Response(JSON.stringify({ error: message, status: response.status }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content ?? '{}';
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error('Could not parse model output', raw);
      return new Response(JSON.stringify({ error: 'The AI returned an unreadable result. Please rephrase and try again.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('match-applications failed', error);
    return new Response(JSON.stringify({ error: 'Unexpected error while filtering applications.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
