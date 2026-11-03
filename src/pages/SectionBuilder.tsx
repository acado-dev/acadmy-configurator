import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FIELD_TYPES, PAGE_LABEL, moveItem, newField, readCustomSections, saveCustomSections, sectionsForPage, validateSectionDefinition, type CustomFieldType, type CustomPage, type CustomSection } from '@/lib/customSections';

const typeLabel = Object.fromEntries(FIELD_TYPES) as Record<CustomFieldType, string>;
const blank = (page: CustomPage): CustomSection => ({ id: crypto.randomUUID(), name: '', description: '', page, active: true, order: 0, fields: [newField()] });

export default function SectionBuilder() {
  const [list, setList] = useState<CustomSection[]>(() => readCustomSections());
  const [page, setPage] = useState<CustomPage>('student'); const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<CustomSection | null>(null); const [errors, setErrors] = useState<string[]>([]); const { toast } = useToast();
  const commit = (next: CustomSection[]) => { setList(next); saveCustomSections(next); };
  const rows = useMemo(() => sectionsForPage(list, page, false).filter(s => s.name.toLowerCase().includes(query.toLowerCase())), [list, page, query]);
  const ordered = sectionsForPage(list, page, false);
  function reorder(id: string, dir: -1 | 1) {
    const i = ordered.findIndex(s => s.id === id); const next = moveItem(ordered, i, i + dir).map((s, idx) => ({ ...s, order: idx + 1 }));
    commit(list.map(s => next.find(n => n.id === s.id) ?? s));
  }
  function save() {
    if (!editing) return; const clean = { ...editing, fields: editing.fields.map(f => f.type === 'select' ? { ...f, options: (f.options || []).map(o => o.trim()).filter(Boolean) } : { ...f, options: undefined }) };
    const errs = validateSectionDefinition(clean); setErrors(errs); if (errs.length) return;
    const exists = list.some(s => s.id === clean.id);
    const prevPage = list.find(s => s.id === clean.id)?.page;
    const withOrder = exists && prevPage === clean.page ? clean : { ...clean, order: sectionsForPage(list, clean.page, false).length + 1 };
    commit(exists ? list.map(s => s.id === clean.id ? withOrder : s) : [...list, withOrder]);
    setEditing(null); toast({ title: exists ? 'Section updated' : 'Section created' });
  }
  const setField = (i: number, patch: Partial<CustomSection['fields'][number]>) => editing && setEditing({ ...editing, fields: editing.fields.map((f, j) => j === i ? { ...f, ...patch } : f) });

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold">Section Builder</h1><p className="mt-1 text-muted-foreground">Create custom Student Life and City Life sections. University admins can add active sections and fill in their content.</p></div><Button onClick={() => { setErrors([]); setEditing(blank(page)); }}><Plus className="mr-2 h-4 w-4" />Create section</Button></div>
    <div className="flex flex-wrap items-center justify-between gap-3"><Tabs value={page} onValueChange={v => setPage(v as CustomPage)}><TabsList><TabsTrigger value="student">Student Life</TabsTrigger><TabsTrigger value="city">City Life</TabsTrigger></TabsList></Tabs><div className="relative w-full max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search sections" placeholder="Search sections" className="pl-9" value={query} onChange={e => setQuery(e.target.value)} /></div></div>
    <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="w-24">Order</TableHead><TableHead>Section</TableHead><TableHead>Fields</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {rows.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No custom {PAGE_LABEL[page]} sections yet.</TableCell></TableRow>}
      {rows.map(s => { const i = ordered.findIndex(o => o.id === s.id); return <TableRow key={s.id}>
        <TableCell><div className="flex items-center gap-1"><span className="w-5 text-sm">{i + 1}</span><Button size="icon" variant="ghost" aria-label={`Move ${s.name} up`} disabled={i === 0 || !!query} onClick={() => reorder(s.id, -1)}><ArrowUp className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label={`Move ${s.name} down`} disabled={i === ordered.length - 1 || !!query} onClick={() => reorder(s.id, 1)}><ArrowDown className="h-4 w-4" /></Button></div></TableCell>
        <TableCell><p className="font-medium">{s.name}</p><p className="text-sm text-muted-foreground">{s.description}</p></TableCell>
        <TableCell><div className="flex max-w-md flex-wrap gap-1">{s.fields.map(f => <Badge key={f.id} variant="outline">{f.label} · {typeLabel[f.type]}{f.required ? ' *' : ''}</Badge>)}</div></TableCell>
        <TableCell><div className="flex items-center gap-2"><Switch aria-label={`${s.name} active`} checked={s.active} onCheckedChange={v => commit(list.map(x => x.id === s.id ? { ...x, active: v } : x))} /><span className="text-sm">{s.active ? 'Active' : 'Inactive'}</span></div></TableCell>
        <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => { setErrors([]); setEditing(structuredClone(s)); }}><Pencil className="mr-1 h-4 w-4" />Edit</Button></TableCell>
      </TableRow>; })}
    </TableBody></Table></CardContent></Card>
    <p className="text-sm text-muted-foreground">Inactive sections are hidden from all universities' configuration and learner pages; saved university content is kept.</p>

    <Dialog open={!!editing} onOpenChange={o => !o && setEditing(null)}><DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">{editing && <>
      <DialogHeader><DialogTitle>{list.some(s => s.id === editing.id) ? 'Edit section' : 'Create section'}</DialogTitle><DialogDescription>Define the section and the fields university admins will fill in.</DialogDescription></DialogHeader>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="sb-name">Section name *</Label><Input id="sb-name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div><div className="space-y-2"><Label>Belongs to</Label><Select value={editing.page} onValueChange={v => setEditing({ ...editing, page: v as CustomPage })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="student">Student Life</SelectItem><SelectItem value="city">City Life</SelectItem></SelectContent></Select></div></div>
        <div className="space-y-2"><Label htmlFor="sb-desc">Short description</Label><Textarea id="sb-desc" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
        <div className="flex items-center gap-3"><Switch id="sb-active" checked={editing.active} onCheckedChange={v => setEditing({ ...editing, active: v })} /><Label htmlFor="sb-active">Active</Label></div>
        <div className="space-y-3"><h3 className="font-semibold">Fields</h3>
          {editing.fields.map((f, i) => <div key={f.id} className="space-y-3 rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-end gap-3"><div className="min-w-48 flex-1 space-y-1"><Label htmlFor={`sb-f-${f.id}`}>Label</Label><Input id={`sb-f-${f.id}`} value={f.label} onChange={e => setField(i, { label: e.target.value })} /></div>
              <div className="w-48 space-y-1"><Label>Type</Label><Select value={f.type} onValueChange={v => setField(i, { type: v as CustomFieldType, options: v === 'select' ? f.options || [] : undefined })}><SelectTrigger aria-label="Field type"><SelectValue /></SelectTrigger><SelectContent>{FIELD_TYPES.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent></Select></div>
              <div className="flex items-center gap-2 pb-2"><Switch id={`sb-r-${f.id}`} checked={f.required} onCheckedChange={v => setField(i, { required: v })} /><Label htmlFor={`sb-r-${f.id}`}>Required</Label></div>
              <div className="flex"><Button size="icon" variant="ghost" aria-label="Move field up" disabled={i === 0} onClick={() => setEditing({ ...editing, fields: moveItem(editing.fields, i, i - 1) })}><ArrowUp className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Move field down" disabled={i === editing.fields.length - 1} onClick={() => setEditing({ ...editing, fields: moveItem(editing.fields, i, i + 1) })}><ArrowDown className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Remove field" onClick={() => setEditing({ ...editing, fields: editing.fields.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button></div></div>
            {f.type === 'select' && <div className="space-y-2"><Label>Options</Label><div className="flex flex-wrap gap-2">{(f.options || []).map((o, k) => <div key={k} className="flex items-center gap-1"><Input aria-label={`Option ${k + 1}`} className="h-8 w-36" value={o} onChange={e => setField(i, { options: (f.options || []).map((x, j) => j === k ? e.target.value : x) })} /><Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Remove option" onClick={() => setField(i, { options: (f.options || []).filter((_, j) => j !== k) })}><X className="h-3.5 w-3.5" /></Button></div>)}<Button size="sm" variant="outline" onClick={() => setField(i, { options: [...(f.options || []), ''] })}><Plus className="mr-1 h-3.5 w-3.5" />Option</Button></div></div>}
            {f.type === 'repeatable' && <p className="text-xs text-muted-foreground">Each card has a title, description and image.</p>}
          </div>)}
          <Button variant="outline" onClick={() => setEditing({ ...editing, fields: [...editing.fields, newField()] })}><Plus className="mr-2 h-4 w-4" />Add field</Button>
        </div>
        {errors.length > 0 && <div role="alert" className="rounded-md border border-destructive p-3 text-sm text-destructive">{errors.map(e => <p key={e}>{e}</p>)}</div>}
      </div>
      <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>Save section</Button></DialogFooter>
    </>}</DialogContent></Dialog>
  </div>;
}
