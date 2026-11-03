import { useId, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowDown, ArrowUp, Plus, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LifeMediaField from '@/components/studentLife/LifeMediaField';
import { moveItem, newCard, type CustomCard, type CustomField, type CustomFile, type CustomSection } from '@/lib/customSections';

function FileField({ label, value, onChange }: { label: string; value?: CustomFile; onChange: (v: CustomFile | undefined) => void }) {
  const id = useId(); const [error, setError] = useState('');
  function upload(file?: File) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError('File must be 10 MB or smaller.'); return; }
    const r = new FileReader(); r.onload = () => { onChange({ name: file.name, url: String(r.result) }); setError(''); }; r.readAsDataURL(file);
  }
  return <div className="space-y-2"><div className="flex flex-wrap items-center gap-2"><Input aria-label={`${label} URL`} placeholder="File URL" value={value?.url.startsWith('data:') ? '' : value?.url || ''} onChange={e => onChange(e.target.value ? { name: e.target.value.split('/').pop() || 'File', url: e.target.value } : undefined)} className="max-w-md" /><Button asChild variant="outline"><label htmlFor={id}><Upload className="mr-2 h-4 w-4" />Upload file</label></Button><input id={id} type="file" className="sr-only" onChange={e => { upload(e.target.files?.[0]); e.target.value = ''; }} />{value && <><span className="text-sm text-muted-foreground">{value.name}</span><Button variant="ghost" size="icon" aria-label={`Remove ${label}`} onClick={() => onChange(undefined)}><X className="h-4 w-4" /></Button></>}</div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}

function CardsField({ label, value, onChange }: { label: string; value: CustomCard[]; onChange: (v: CustomCard[]) => void }) {
  const set = (i: number, patch: Partial<CustomCard>) => onChange(value.map((c, j) => j === i ? { ...c, ...patch } : c));
  return <div className="space-y-3">{value.map((c, i) => <Card key={c.id}><CardContent className="space-y-3 pt-4"><div className="flex items-center justify-between"><p className="text-sm font-medium">{label} · card {i + 1}</p><div className="flex gap-1"><Button size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => onChange(moveItem(value, i, i - 1))}><ArrowUp className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Move down" disabled={i === value.length - 1} onClick={() => onChange(moveItem(value, i, i + 1))}><ArrowDown className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label="Remove card" onClick={() => onChange(value.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button></div></div><Input placeholder="Title" value={c.title} onChange={e => set(i, { title: e.target.value })} /><Textarea placeholder="Description" value={c.description} onChange={e => set(i, { description: e.target.value })} /><LifeMediaField label="Card image" value={c.image} onChange={v => set(i, { image: v })} /></CardContent></Card>)}<Button variant="outline" onClick={() => onChange([...value, newCard()])}><Plus className="mr-2 h-4 w-4" />Add card</Button></div>;
}

function FieldInput({ field, value, onChange }: { field: CustomField; value: unknown; onChange: (v: unknown) => void }) {
  const id = `cf-${field.id}`; const label = `${field.label}${field.required ? ' *' : ''}`;
  if (field.type === 'image') return <LifeMediaField label={label} value={String(value ?? '')} onChange={onChange} />;
  const control = (() => { switch (field.type) {
    case 'textarea': return <Textarea id={id} value={String(value ?? '')} onChange={e => onChange(e.target.value)} />;
    case 'richtext': return <ReactQuill theme="snow" value={String(value ?? '')} onChange={onChange} />;
    case 'video': return <Input id={id} type="url" placeholder="https://" value={String(value ?? '')} onChange={e => onChange(e.target.value)} />;
    case 'datetime': return <Input id={id} type="datetime-local" className="max-w-xs" value={String(value ?? '')} onChange={e => onChange(e.target.value)} />;
    case 'select': return <Select value={String(value ?? '') || undefined} onValueChange={onChange}><SelectTrigger id={id} className="max-w-xs"><SelectValue placeholder="Select an option" /></SelectTrigger><SelectContent>{(field.options || []).filter(o => o.trim()).map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>;
    case 'file': return <FileField label={field.label} value={value as CustomFile | undefined} onChange={onChange} />;
    case 'repeatable': return <CardsField label={field.label} value={Array.isArray(value) ? value as CustomCard[] : []} onChange={onChange} />;
    default: return <Input id={id} value={String(value ?? '')} onChange={e => onChange(e.target.value)} />;
  } })();
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{control}</div>;
}

export default function CustomSectionEditor({ section, values, onChange }: { section: CustomSection; values: Record<string, unknown>; onChange: (v: Record<string, unknown>) => void }) {
  return <section className="space-y-5"><div><h2 className="text-xl font-semibold">{section.name}</h2>{section.description && <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>}<p className="mt-1 text-xs text-muted-foreground">Section structure is managed by Super Admin in Section Builder.</p></div>{section.fields.map(f => <FieldInput key={f.id} field={f} value={values[f.id]} onChange={v => onChange({ ...values, [f.id]: v })} />)}</section>;
}
