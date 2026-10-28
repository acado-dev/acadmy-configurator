import { useEffect, useId, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { cityMediaUrl } from '@/lib/cityLife';
export default function CityMediaField({ label, value, universityId, disabled, onChange }: { label: string; value: string; universityId: string; disabled?: boolean; onChange: (value: string) => void }) {
  const id = useId(); const [url, setUrl] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { let alive = true; cityMediaUrl(value).then(v => { if (alive) setUrl(v); }); return () => { alive = false; }; }, [value]);
  async function upload(file?: File) {
    if (!file) return; setError('');
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) { setError('Choose a JPG, PNG or WebP image up to 10 MB.'); return; }
    setBusy(true);
    try { const { data: auth } = await supabase.auth.getUser(); if (!auth.user) throw new Error('A Cloud admin account is required to upload.');
      const path = `${universityId}/${crypto.randomUUID()}.${file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1]}`;
      const result = await supabase.storage.from('city-life-media').upload(path, file, { contentType: file.type });
      if (result.error) throw result.error; onChange(path);
    } catch (e) { setError(e instanceof Error ? e.message : 'Image upload failed.'); } finally { setBusy(false); }
  }
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} placeholder="https://… or upload an image" value={value || ''} onChange={e => onChange(e.target.value)} /><div className="flex flex-wrap gap-2"><Button asChild variant="outline" size="sm" disabled={disabled || busy}><label htmlFor={`${id}-file`}><ImagePlus className="mr-2 h-4 w-4" />{busy ? 'Uploading…' : 'Upload image'}</label></Button><input id={`${id}-file`} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={disabled || busy} onChange={e => { void upload(e.target.files?.[0]); e.target.value = ''; }} />{value && <Button variant="ghost" size="icon" aria-label={`Remove ${label}`} onClick={() => onChange('')}><X className="h-4 w-4" /></Button>}</div>{url && <img src={url} alt={`${label} preview`} width={480} height={270} className="aspect-video max-h-48 w-full rounded-md object-cover" />}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}