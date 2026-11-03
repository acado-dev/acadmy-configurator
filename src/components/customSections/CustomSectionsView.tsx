import DOMPurify from 'dompurify';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { enabledCustom, isEmptyValue, readCustomSections, type CustomCard, type CustomFile, type CustomPage, type CustomValues } from '@/lib/customSections';

function embed(url: string) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/); if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/); if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

/** Renders the Super-Admin-defined sections a university enabled, from their field definitions. */
export default function CustomSectionsView({ page, enabled, values, className = '' }: { page: CustomPage; enabled?: string[]; values?: CustomValues; className?: string }) {
  const sections = enabledCustom(readCustomSections(), page, enabled);
  return <>{sections.map(s => { const v = values?.[s.id] || {}; const fields = s.fields.filter(f => !isEmptyValue(f, v[f.id])); if (!fields.length) return null;
    return <section key={s.id} id={`custom-${s.id}`} className={`space-y-4 ${className}`}><h2 className="text-2xl font-bold">{s.name}</h2>{fields.map(f => { const val = v[f.id];
      switch (f.type) {
        case 'image': return <img key={f.id} src={String(val)} alt={f.label} loading="lazy" className="max-h-96 w-full rounded-lg object-cover" />;
        case 'richtext': return <div key={f.id} className="prose max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(val)) }} />;
        case 'video': { const src = embed(String(val)); return src ? <iframe key={f.id} src={src} title={f.label} className="aspect-video w-full rounded-lg" allowFullScreen /> : <video key={f.id} src={String(val)} controls preload="metadata" className="aspect-video w-full rounded-lg" />; }
        case 'file': { const file = val as CustomFile; return <Button key={f.id} asChild variant="outline"><a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer"><FileText className="mr-2 h-4 w-4" />{f.label}: {file.name}</a></Button>; }
        case 'datetime': return <p key={f.id}><span className="text-sm text-muted-foreground">{f.label}: </span><span className="font-medium">{new Date(String(val)).toLocaleString()}</span></p>;
        case 'select': case 'text': return <p key={f.id}><span className="text-sm text-muted-foreground">{f.label}: </span><span className="font-medium">{String(val)}</span></p>;
        case 'repeatable': return <div key={f.id} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(val as CustomCard[]).map(c => <article key={c.id} className="overflow-hidden rounded-lg border border-border">{c.image && <img src={c.image} alt={c.title} loading="lazy" className="aspect-video w-full object-cover" />}<div className="space-y-1 p-4"><h3 className="font-semibold">{c.title}</h3><p className="whitespace-pre-wrap text-sm text-muted-foreground">{c.description}</p></div></article>)}</div>;
        default: return <p key={f.id} className="whitespace-pre-wrap text-muted-foreground">{String(val)}</p>;
      } })}</section>; })}</>;
}
