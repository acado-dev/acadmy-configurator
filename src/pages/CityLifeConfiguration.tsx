import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Send, Undo2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cityAdminScope, loadCity, saveCity, type CityRecord } from '@/lib/cityLife';
import { cityEntry, cityCollections, sampleCity, type CityContent, type CityCollection } from '@/lib/cityLifeRules';
import CityMediaField from '@/components/cityLife/CityMediaField';
import CityCollectionEditor from '@/components/cityLife/CityCollectionEditor';
import CityLifePage from '@/components/cityLife/CityLifePage';
import sampleImage from '@/assets/city-life-jyvaskyla.jpg';
const sections = [['hero','Hero'],['facts','City Facts'],['weather','Weather Setup'],['seasons','Seasons'],['places','Places'],['housing','Housing'],['gallery','Gallery'],['faqs','FAQs'],['guidance','Study Guidance'],['publishing','Publishing']];
function normalize(content: CityContent) {
  const next = { ...sampleCity(), ...content };
  for (const key of cityCollections) next[key] = (content[key] || []).map(e => cityEntry(e));
  return next;
}
export default function CityLifeConfiguration() {
  const { universityId } = useParams(); const universityPanel = useLocation().pathname.startsWith('/university/');
  const [id,setId] = useState(''); const [name,setName] = useState(''); const [draft,setDraft] = useState<CityContent | null>(null); const [record,setRecord] = useState<CityRecord | null>(null);
  const [authorized,setAuthorized] = useState(false); const [loaded,setLoaded] = useState(false); const [busy,setBusy] = useState(false); const [error,setError] = useState(''); const [preview,setPreview] = useState(false); const [dirty,setDirty] = useState(false); const [accessNote,setAccessNote] = useState(''); const { toast } = useToast();
  useEffect(() => {
    let alive = true;
    async function load() {
      setLoaded(false); setError('');
      try {
        const scope = await cityAdminScope(universityId,universityPanel);
        // Browser context is presentation-only; it never grants Cloud access.
        const context = JSON.parse(localStorage.getItem('universityAdmin') || 'null');
        const selected = scope || (universityPanel ? context?.universityId : universityId);
        if (!selected) throw new Error('Open City Life from a university to select its content.');
        const universities = JSON.parse(localStorage.getItem('acado_universities') || '[]');
        const university = universities.find((u: {id:string}) => u.id === selected);
        const universityName = university?.name || (selected === 'u-jamk' ? 'Jamk University of Applied Sciences' : 'University');
        const saved = scope ? await loadCity(selected) : null;
        const content = saved ? normalize(saved.draft) : sampleCity(university?.location?.city,university?.location?.country);
        if (!saved) { content.hero = sampleImage; content.heroAlt = 'Illustrative lakeside cycling scene in Finland'; content.gallery = [cityEntry({ image: sampleImage, alt: content.heroAlt, caption: 'Sample city-life image', category: 'lifestyle' })]; }
        if (alive) { setId(selected); setName(saved?.university_name || universityName); setRecord(saved); setDraft(content); setAuthorized(!!scope); setDirty(false); setAccessNote(scope ? '' : 'Sample preview only. Cloud saving and uploads require a signed-in Cloud admin assigned to this university. Your prototype login does not grant that access.'); }
      } catch (e) { if (alive) setError(e instanceof Error ? e.message : 'Unable to load City Life.'); } finally { if (alive) setLoaded(true); }
    }
    void load(); const { data } = supabase.auth.onAuthStateChange(() => { window.setTimeout(() => void load(),0); });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, [universityId,universityPanel]);
  function change<K extends keyof CityContent>(key: K,value: CityContent[K]) { setDraft(d => d ? {...d,[key]:value}:d); setDirty(true); }
  async function persist(action: 'draft'|'publish'|'unpublish') {
    if (!draft || !authorized) return; setBusy(true); setError('');
    try { const result = await saveCity(id,name,draft,action); setRecord(result); setDirty(false); toast({title: action==='publish'?'City Life published':action==='unpublish'?'City Life unpublished':'Draft saved'}); } catch(e) { setError(e instanceof Error ? e.message : 'Unable to save City Life.'); } finally { setBusy(false); }
  }
  if (!loaded || !draft) return <div className="py-12"><h1 className="text-2xl font-semibold">City Life</h1><p role={error?'alert':undefined} className="mt-3 text-muted-foreground">{error || 'Loading City Life…'}</p></div>;
  const field = (key: keyof CityContent,label: string,area=false) => <div className="space-y-2"><Label htmlFor={`city-${key}`}>{label}</Label>{area ? <Textarea id={`city-${key}`} value={String(draft[key])} onChange={e => change(key,e.target.value)} /> : <Input id={`city-${key}`} value={String(draft[key])} onChange={e => change(key,e.target.value)} />}</div>;
  const toggle = (key: 'weatherEnabled'|'aiEnabled',label:string) => <div className="flex items-center gap-3"><Switch id={`city-${key}`} checked={draft[key]} onCheckedChange={v => change(key,v)} /><Label htmlFor={`city-${key}`}>{label}</Label></div>;
  const collection = (kind: CityCollection) => <CityCollectionEditor kind={kind} entries={draft[kind]} universityId={id} authorized={authorized} onChange={v => change(kind,v)} />;
  return <div className="min-w-0 space-y-6 pb-8"><header className="flex flex-wrap items-center gap-4"><Button asChild variant="ghost" size="icon"><Link aria-label="Back to university" to={universityPanel?'/university/info':`/universities/${id}/details`}><ArrowLeft className="h-5 w-5" /></Link></Button><div className="min-w-0 flex-1"><h1 className="text-3xl font-bold">City Life Configuration</h1><p className="mt-2 text-muted-foreground">{name}</p><p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{draft.city}, {draft.country}</p></div><Badge variant={record?.published?'default':'secondary'}>{record?.published?'Published':'Draft'}</Badge>{!authorized && <Badge variant="outline">Sample preview</Badge>}</header>
    <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-y border-border bg-background py-3"><p className="text-sm text-muted-foreground">{dirty?'Unsaved changes':record?`Saved ${new Date(record.saved_at).toLocaleString()}`:'Not saved'}</p><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={!authorized || busy} onClick={() => void persist('draft')}><Save className="mr-2 h-4 w-4" />Save draft</Button><Button variant="outline" onClick={() => setPreview(true)}><Eye className="mr-2 h-4 w-4" />Preview</Button><Button disabled={!authorized || busy} onClick={() => void persist('publish')}><Send className="mr-2 h-4 w-4" />Publish</Button><AlertDialog><AlertDialogTrigger asChild><Button variant="outline" disabled={!authorized || !record?.published || busy}><Undo2 className="mr-2 h-4 w-4" />Unpublish</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Unpublish City Life?</AlertDialogTitle><AlertDialogDescription>Learners will no longer see this content. Your draft will remain saved.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => void persist('unpublish')}>Unpublish</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></div>
    {accessNote && <p className="border-l-2 border-border pl-4 text-sm text-muted-foreground">{accessNote}</p>}{error && <p role="alert" className="whitespace-pre-line text-sm text-destructive">{error}</p>}
    <Tabs defaultValue="hero" className="min-w-0"><TabsList className="mb-6 flex h-auto flex-wrap justify-start gap-1">{sections.map(([key,label]) => <TabsTrigger key={key} value={key}>{label}</TabsTrigger>)}</TabsList>
      <TabsContent value="hero" className="space-y-5"><h2 className="text-xl font-semibold">Hero & city identity</h2><div className="grid gap-4 md:grid-cols-2">{field('title','Page title')}{field('city','City name')}{field('country','Country')}{field('campus','University campus reference / location context')}</div>{field('introduction','Short introduction',true)}<div className="grid gap-4 md:grid-cols-2"><CityMediaField label="Hero image" value={draft.hero} universityId={id} disabled={!authorized} onChange={v => change('hero',v)} /><div className="space-y-4">{field('heroAlt','Hero image alt text')}<div className="space-y-2"><Label>Hero focal point</Label><Select value={draft.focalPoint} onValueChange={v => change('focalPoint',v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['top','center','bottom'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div><CityMediaField label="City thumbnail (optional)" value={draft.thumbnail} universityId={id} disabled={!authorized} onChange={v => change('thumbnail',v)} /></div></div></TabsContent>
      <TabsContent value="facts">{collection('facts')}</TabsContent>
      <TabsContent value="weather" className="space-y-5"><h2 className="text-xl font-semibold">Live weather setup</h2>{toggle('weatherEnabled','Show weather on the learner page')}<div className="grid gap-4 md:grid-cols-2">{field('latitude','Latitude')}{field('longitude','Longitude')}{field('weatherLabel','Weather display city label')}</div><p className="text-sm text-muted-foreground">No weather service is connected. The learner page displays an unavailable state, not sample current conditions.</p></TabsContent>
      <TabsContent value="seasons">{collection('seasons')}</TabsContent><TabsContent value="places">{collection('places')}</TabsContent><TabsContent value="housing">{collection('housing')}</TabsContent><TabsContent value="gallery">{collection('gallery')}</TabsContent><TabsContent value="faqs">{collection('faqs')}</TabsContent>
      <TabsContent value="guidance" className="space-y-5"><h2 className="text-xl font-semibold">Study Guidance</h2>{field('guidanceHeading','Heading')}{field('guidanceDescription','Description',true)}{toggle('aiEnabled','Enable Acado AI study guidance entry point')}<p className="text-sm text-muted-foreground">AI guidance is not connected yet; enabling this shows its internal entry point with an unavailable state.</p><div className="grid gap-4 md:grid-cols-2">{field('managerLabel','Talk to a Study Manager label')}{field('appointmentUrl','Appointment calendar URL · external destination (new tab)')}</div><fieldset className="space-y-3"><legend className="mb-3 font-medium">Relevant FAQs</legend>{draft.faqs.filter(e => e.visible).map(e => <div key={e.id} className="flex items-center gap-3"><Checkbox id={`guidance-${e.id}`} checked={draft.guidanceFaqIds.includes(e.id)} onCheckedChange={v => change('guidanceFaqIds',v?[...draft.guidanceFaqIds,e.id]:draft.guidanceFaqIds.filter(id => id!==e.id))} /><Label htmlFor={`guidance-${e.id}`}>{e.title || 'Untitled FAQ'}</Label></div>)}</fieldset></TabsContent>
      <TabsContent value="publishing" className="space-y-5"><h2 className="text-xl font-semibold">Publishing</h2><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-sm text-muted-foreground">Draft saved</dt><dd>{record?new Date(record.saved_at).toLocaleString():'Not saved'}</dd></div><div><dt className="text-sm text-muted-foreground">Published version</dt><dd>{record?.published_at?new Date(record.published_at).toLocaleString():'Not published'}</dd></div></dl><p className="text-sm text-muted-foreground">Draft changes remain private until published. Unpublishing keeps the draft.</p><Button asChild variant="outline"><Link to={`/user/universities/${id}/city-life`}>View published City Life <Eye className="ml-2 h-4 w-4" /></Link></Button></TabsContent>
    </Tabs><Dialog open={preview} onOpenChange={setPreview}><DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto"><DialogHeader><DialogTitle>City Life · Draft preview</DialogTitle><DialogDescription>{name}</DialogDescription></DialogHeader><CityLifePage content={draft} universityName={name} /></DialogContent></Dialog></div>;
}