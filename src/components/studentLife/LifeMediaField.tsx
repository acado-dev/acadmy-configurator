import { useId, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
export default function LifeMediaField({ label, value, onChange, video = false }: { label: string; value: string; onChange: (value: string) => void; video?: boolean }) {
  const id = useId(); const [error, setError] = useState('');
  async function upload(file: File | undefined) {
    if (!file) return;
    if (!(video ? ['video/mp4', 'video/webm'] : ['image/jpeg', 'image/png', 'image/webp']).includes(file.type)) { setError(video ? 'Choose an MP4 or WebM video.' : 'Choose a JPG, PNG or WebP image.'); return; }
    if (file.size > (video ? 20 : 10) * 1024 * 1024) { setError(`File must be ${video ? 20 : 10} MB or smaller.`); return; }
    const reader = new FileReader(); reader.onload = () => { onChange(String(reader.result)); setError(''); }; reader.onerror = () => setError('Unable to read this file.'); reader.readAsDataURL(file);
  }
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><div className="flex gap-2"><Input id={id} value={value.startsWith('data:') ? '' : value} placeholder={video ? 'Video URL' : 'Image URL'} onChange={e => { onChange(e.target.value); setError(''); }} /><Button asChild variant="outline" className="shrink-0"><label htmlFor={`${id}-upload`}><Upload className="mr-2 h-4 w-4" />Upload</label></Button><input id={`${id}-upload`} type="file" className="sr-only" accept={video ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp'} onChange={e => { void upload(e.target.files?.[0]); e.target.value = ''; }} />{value && <Button variant="ghost" size="icon" aria-label={`Remove ${label}`} onClick={() => onChange('')}><X className="h-4 w-4" /></Button>}</div>{value && (video ? <video src={value} controls preload="metadata" className="max-h-40 rounded-md" /> : <img src={value} alt={`${label} preview`} className="h-28 max-w-full rounded-md object-cover" />)}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}
