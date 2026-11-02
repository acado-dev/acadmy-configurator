import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  id: string;
  label: string;
  url: string;
  name?: string;
  imageOnly?: boolean;
  onChange: (url: string, name: string) => void;
}

export default function CourseContentMedia({ id, label, url, name, imageOnly = false, onChange }: Props) {
  const isImage = imageOnly || url.startsWith('data:image/') || /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(url);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="file" accept={imageOnly ? 'image/*' : undefined} onChange={(event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (imageOnly && !file.type.startsWith('image/')) {
          toast({ title: 'Choose an image file', variant: 'destructive' });
          event.target.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') onChange(reader.result, file.name);
        };
        reader.onerror = () => toast({ title: 'Unable to read file', variant: 'destructive' });
        reader.readAsDataURL(file);
        event.target.value = '';
      }} />
      <Input aria-label={`${label} URL`} type="url" placeholder={imageOnly ? 'Or paste an image URL' : 'Or paste a file URL'} value={url.startsWith('data:') ? '' : url} onChange={(event) => onChange(event.target.value, '')} />
      {url && <div className="flex items-center gap-3">
        {isImage ? <img src={url} alt={label} className="h-24 w-36 object-contain rounded border" /> : <span className="text-sm break-all">{name || 'Career pathway file'}</span>}
        <Button type="button" variant="ghost" size="icon" title={`Remove ${label.toLowerCase()}`} aria-label={`Remove ${label.toLowerCase()}`} onClick={() => onChange('', '')}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>}
    </div>
  );
}