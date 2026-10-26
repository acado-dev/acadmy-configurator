import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Users } from 'lucide-react';
import { resolveCommunityImage } from '@/lib/communities';
export function StatusBadge({ active }: { active: boolean }) { return <Badge variant={active ? 'default' : 'secondary'}>{active ? 'Active' : 'Inactive'}</Badge>; }
export function CommunityImage({ value, name, large = false }: { value: string; name: string; large?: boolean }) {
  const [url, setUrl] = useState('');
  useEffect(() => { let live = true; setUrl(''); void resolveCommunityImage(value).then(url => { if (live) setUrl(url); }); return () => { live = false; }; }, [value]);
  const size = large ? 'h-24 w-24' : 'h-12 w-12';
  return url ? <img src={url} alt={name} onError={() => setUrl('')} className={`${size} shrink-0 rounded-md object-cover border`} /> : <div className={`${size} shrink-0 rounded-md bg-muted flex items-center justify-center`}><Users className="h-6 w-6 text-muted-foreground" /></div>;
}
export function Choice({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: { value: string; label: string }[] }) {
  return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="min-w-40"><SelectValue placeholder={label} /></SelectTrigger><SelectContent>{options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>;
}
export function ConfirmAction({ action, busy, onCancel, onConfirm }: { action: { title: string; description: string } | null; busy: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <AlertDialog open={!!action} onOpenChange={open => { if (!open && !busy) onCancel(); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{action?.title}</AlertDialogTitle><AlertDialogDescription>{action?.description}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel><Button variant="destructive" disabled={busy} onClick={onConfirm}>{busy ? 'Please wait…' : 'Confirm'}</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
