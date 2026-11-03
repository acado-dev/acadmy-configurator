import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Props {
  sections: string[][];
  hidden: string[];
  fixed?: string[];
  onChange: (hidden: string[]) => void;
}

/** Tab strip with remove (−) per optional section and an "Add section" menu for removed ones. */
export default function SectionTabsList({ sections, hidden, fixed = ['publishing'], onChange }: Props) {
  const removed = sections.filter(([id]) => hidden.includes(id));
  return <div className="mb-6 flex flex-wrap items-center gap-2">
    <TabsList className="flex h-auto flex-wrap justify-start gap-1">
      {sections.filter(([id]) => !hidden.includes(id)).map(([id, label]) => <div key={id} className="flex items-center">
        <TabsTrigger value={id}>{label}</TabsTrigger>
        {!fixed.includes(id) && <AlertDialog>
          <AlertDialogTrigger asChild><Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive" aria-label={`Remove ${label} section`}><Minus className="h-3.5 w-3.5" /></Button></AlertDialogTrigger>
          <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove {label}?</AlertDialogTitle><AlertDialogDescription>This section will be hidden from the configuration and the learner page. Its content is kept, so you can add it back later.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => onChange([...hidden, id])}>Remove section</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
        </AlertDialog>}
      </div>)}
    </TabsList>
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button type="button" variant="outline" size="sm" disabled={!removed.length}><Plus className="mr-1 h-4 w-4" />Add section{removed.length ? ` (${removed.length})` : ''}</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start"><DropdownMenuLabel>Removed sections</DropdownMenuLabel>
        {removed.map(([id, label]) => <DropdownMenuItem key={id} onSelect={() => onChange(hidden.filter(h => h !== id))}><Plus className="mr-2 h-4 w-4" />{label}</DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>;
}
