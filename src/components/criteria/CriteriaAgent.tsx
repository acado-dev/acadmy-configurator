import React, { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Wand2, Loader2, AlertTriangle, Plus, Trash2, Check, RefreshCw, Scale, ShieldCheck, Sparkle,
} from 'lucide-react';

export interface AgentCriterion {
  id: string;
  fieldName: string;
  type: 'required' | 'weighted' | 'preferred';
  weight: number;
  conditions: string[];
  rationale?: string;
}

interface CriteriaAgentProps {
  availableFields?: string[];
  context?: string;
  existingCriteria?: AgentCriterion[];
  existingMinimumScore?: number;
  onApply: (criteria: AgentCriterion[], minimumScore: number) => void;
}

const EXAMPLES = [
  'Shortlist candidates with GPA above 3.5, IELTS at least 6.5 and at least 2 years of work experience. Weight academics highest.',
  'Bachelor degree in Computer Science is mandatory. Prefer applicants from India or Nepal with strong statement of purpose.',
  'Give 40% to test scores, 30% to academics, 20% to experience and 10% to recommendation letters. Cut-off 75%.',
];

const typeMeta: Record<AgentCriterion['type'], { label: string; variant: 'destructive' | 'default' | 'secondary'; icon: React.ElementType; help: string }> = {
  required: { label: 'Must have', variant: 'destructive', icon: ShieldCheck, help: 'Application is rejected if this fails' },
  weighted: { label: 'Scored', variant: 'default', icon: Scale, help: 'Contributes to the match score' },
  preferred: { label: 'Bonus', variant: 'secondary', icon: Sparkle, help: 'Nice to have, small uplift' },
};

export const CriteriaAgent: React.FC<CriteriaAgentProps> = ({
  availableFields = [],
  context,
  existingCriteria = [],
  existingMinimumScore = 70,
  onApply,
}) => {
  const { toast } = useToast();
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<AgentCriterion[] | null>(null);
  const [draftScore, setDraftScore] = useState(existingMinimumScore);
  const [summary, setSummary] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const totalWeight = useMemo(
    () => (draft ?? []).filter(c => c.type === 'weighted').reduce((s, c) => s + (Number(c.weight) || 0), 0),
    [draft],
  );

  const runAgent = async (refine = false) => {
    const text = instruction.trim();
    if (text.length < 5) {
      toast({ title: 'Add a bit more detail', description: 'Describe your criteria in a sentence or two.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-criteria', {
        body: {
          instruction: text,
          availableFields,
          context,
          existingCriteria: refine ? (draft ?? []) : existingCriteria,
        },
      });

      if (error) {
        const details = (error as any)?.context ? await (error as any).context.text?.() : error.message;
        console.error('parse-criteria failed:', details);
        toast({ title: 'Could not interpret criteria', description: 'Please try again in a moment.', variant: 'destructive' });
        return;
      }
      if ((data as any)?.error) {
        toast({ title: 'Could not interpret criteria', description: (data as any).error, variant: 'destructive' });
        return;
      }

      const parsed: AgentCriterion[] = ((data as any)?.criteria ?? []).map((c: any, i: number) => ({
        id: `${Date.now()}-${i}`,
        fieldName: String(c.fieldName ?? '').slice(0, 120),
        type: ['required', 'weighted', 'preferred'].includes(c.type) ? c.type : 'weighted',
        weight: Math.max(0, Math.min(100, Number(c.weight) || 0)),
        conditions: Array.isArray(c.conditions) ? c.conditions.map((x: any) => String(x).slice(0, 120)) : [],
        rationale: c.rationale ? String(c.rationale).slice(0, 300) : undefined,
      }));

      setDraft(parsed);
      setDraftScore(Math.max(0, Math.min(100, Number((data as any)?.minimumScore) || 70)));
      setSummary(String((data as any)?.summary ?? ''));
      setWarnings(Array.isArray((data as any)?.warnings) ? (data as any).warnings.map((w: any) => String(w)) : []);
      setHistory(prev => [...prev, text]);
      setInstruction('');
    } finally {
      setLoading(false);
    }
  };

  const update = (id: string, patch: Partial<AgentCriterion>) =>
    setDraft(prev => (prev ?? []).map(c => (c.id === id ? { ...c, ...patch } : c)));

  const remove = (id: string) => setDraft(prev => (prev ?? []).filter(c => c.id !== id));

  const addBlank = () =>
    setDraft(prev => [...(prev ?? []), { id: `${Date.now()}`, fieldName: '', type: 'weighted', weight: 0, conditions: [] }]);

  const apply = () => {
    const cleaned = (draft ?? []).filter(c => c.fieldName.trim());
    if (!cleaned.length) {
      toast({ title: 'Nothing to apply', description: 'Add at least one criterion.', variant: 'destructive' });
      return;
    }
    onApply(cleaned, draftScore);
    toast({ title: 'Criteria applied', description: `${cleaned.length} criteria added to the configuration.` });
  };

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-primary" />
          Criteria Agent
        </CardTitle>
        <CardDescription>
          Describe your evaluation rules in plain English. The agent turns them into structured criteria you can review, correct and extend.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Input */}
        <div className="space-y-2">
          <Label htmlFor="criteria-instruction">
            {draft ? 'Refine or add more criteria' : 'Your criteria in plain English'}
          </Label>
          <Textarea
            id="criteria-instruction"
            value={instruction}
            maxLength={6000}
            rows={4}
            placeholder={draft
              ? 'e.g. Also make IELTS 7.0 mandatory and reduce work experience weight to 10%'
              : 'e.g. Shortlist candidates with GPA above 3.5, IELTS at least 6.5, and 2+ years of work experience. Academics matter most.'}
            onChange={(e) => setInstruction(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setInstruction(ex)}
                className="text-xs px-2 py-1 rounded-md border text-muted-foreground hover:bg-accent transition-colors text-left max-w-full truncate"
              >
                {ex.slice(0, 60)}…
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => runAgent(Boolean(draft))} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {draft ? 'Update criteria' : 'Interpret criteria'}
            </Button>
            {draft && (
              <Button variant="outline" className="gap-2" onClick={() => { setDraft(null); setSummary(''); setWarnings([]); setHistory([]); }}>
                <RefreshCw className="w-4 h-4" />
                Start over
              </Button>
            )}
          </div>
        </div>

        {draft && (
          <>
            <Separator />

            {/* Understanding */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">What the agent understood</h3>
              {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
              {history.length > 0 && (
                <div className="space-y-1">
                  {history.map((h, i) => (
                    <p key={i} className="text-xs text-muted-foreground border-l-2 pl-2 italic">“{h}”</p>
                  ))}
                </div>
              )}
              {warnings.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      {warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Weight visualisation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Weight distribution</h3>
                <Badge variant={totalWeight === 100 ? 'default' : 'destructive'}>{totalWeight}% of 100%</Badge>
              </div>
              <Progress value={Math.min(totalWeight, 100)} />
              <div className="space-y-2">
                {(draft.filter(c => c.type === 'weighted')).map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="text-xs w-40 truncate">{c.fieldName || 'Unnamed'}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(c.weight, 100)}%` }} />
                    </div>
                    <span className="text-xs w-10 text-right">{c.weight}%</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(['required', 'weighted', 'preferred'] as const).map(t => {
                  const count = draft.filter(c => c.type === t).length;
                  const Icon = typeMeta[t].icon;
                  return (
                    <Badge key={t} variant={typeMeta[t].variant} className="gap-1">
                      <Icon className="w-3 h-3" />
                      {count} {typeMeta[t].label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Editable criteria */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Review &amp; correct</h3>
                <Button size="sm" variant="outline" className="gap-2" onClick={addBlank}>
                  <Plus className="w-4 h-4" /> Add criterion
                </Button>
              </div>

              {draft.map(c => (
                <div key={c.id} className="rounded-lg border p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-4">
                      <Label className="text-xs">Field</Label>
                      <Input
                        value={c.fieldName}
                        maxLength={120}
                        list="criteria-agent-fields"
                        onChange={(e) => update(c.id, { fieldName: e.target.value })}
                        placeholder="e.g. GPA"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Label className="text-xs">Type</Label>
                      <Select value={c.type} onValueChange={(v: AgentCriterion['type']) => update(c.id, { type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="z-50 bg-background">
                          <SelectItem value="required">Must have</SelectItem>
                          <SelectItem value="weighted">Scored</SelectItem>
                          <SelectItem value="preferred">Bonus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs">Weight %</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={c.weight}
                        disabled={c.type !== 'weighted'}
                        onChange={(e) => update(c.id, { weight: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                      />
                    </div>
                    <div className="md:col-span-3 flex items-end gap-2">
                      <div className="flex-1">
                        <Label className="text-xs">Conditions</Label>
                        <Input
                          value={c.conditions.join(', ')}
                          onChange={(e) => update(c.id, { conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          placeholder="e.g. >= 3.5"
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => remove(c.id)} aria-label="Remove criterion">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {c.rationale && <p className="text-xs text-muted-foreground">{c.rationale}</p>}
                </div>
              ))}

              <datalist id="criteria-agent-fields">
                {availableFields.map(f => <option key={f} value={f} />)}
              </datalist>
            </div>

            {/* Cut-off + apply */}
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="md:w-56">
                <Label className="text-xs">Minimum overall score (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={draftScore}
                  onChange={(e) => setDraftScore(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                />
              </div>
              <Button onClick={apply} variant="gradient" className="gap-2">
                <Check className="w-4 h-4" />
                Apply to configuration
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CriteriaAgent;
