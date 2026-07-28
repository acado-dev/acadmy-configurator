import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const SYSTEM_PROMPT = `You are an admissions evaluation-criteria analyst.
You convert plain-English admission requirements into a structured, machine-usable evaluation rubric.

Rules:
- Return ONLY a JSON object matching the given schema.
- Each criterion maps to ONE applicant attribute (field).
- type: "required" = hard filter (must pass), "weighted" = contributes score, "preferred" = nice-to-have bonus.
- Conditions are short human-readable rules, e.g. ">= 3.5", "IELTS >= 6.5", "in: India, Nepal", "min 2 years".
- Weights are percentages. Weighted criteria weights SHOULD total 100. If the user did not give weights, distribute sensibly by importance.
- minimumScore is the overall cut-off percentage (default 70 if unspecified).
- Add a "warnings" entry for anything ambiguous, contradictory, missing, or where you had to assume something.
- "summary" is 1-3 plain-English sentences describing the resulting rubric.
- If the user provides existing criteria, MERGE their new instruction into them instead of starting over.`;

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
    const instruction = typeof body.instruction === 'string' ? body.instruction.trim().slice(0, 6000) : '';
    const availableFields: string[] = Array.isArray(body.availableFields)
      ? body.availableFields.filter((f: unknown) => typeof f === 'string').slice(0, 200)
      : [];
    const existingCriteria = Array.isArray(body.existingCriteria) ? body.existingCriteria.slice(0, 100) : [];
    const context = typeof body.context === 'string' ? body.context.slice(0, 500) : '';

    if (!instruction) {
      return new Response(JSON.stringify({ error: 'Please describe your criteria in plain English.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userContent = [
      context ? `Context: ${context}` : '',
      availableFields.length ? `Available application fields (prefer these exact names): ${availableFields.join(', ')}` : '',
      existingCriteria.length ? `Existing criteria (JSON): ${JSON.stringify(existingCriteria)}` : 'There are no existing criteria yet.',
      `Admissions officer instruction:\n"""${instruction}"""`,
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
            name: 'evaluation_rubric',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                minimumScore: { type: 'number' },
                summary: { type: 'string' },
                warnings: { type: 'array', items: { type: 'string' } },
                criteria: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      fieldName: { type: 'string' },
                      type: { type: 'string', enum: ['required', 'weighted', 'preferred'] },
                      weight: { type: 'number' },
                      conditions: { type: 'array', items: { type: 'string' } },
                      rationale: { type: 'string' },
                    },
                    required: ['fieldName', 'type', 'weight', 'conditions', 'rationale'],
                  },
                },
              },
              required: ['minimumScore', 'summary', 'warnings', 'criteria'],
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
    console.error('parse-criteria failed', error);
    return new Response(JSON.stringify({ error: 'Unexpected error while parsing criteria.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
