import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Pencil, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { deleteSkill, getOpportunities, getSkills, saveSkill, SkillOption } from '@/lib/jobsStorage';

export default function SkillsMaster() {
  const [skills, setSkills] = useState(getSkills());
  const opps = getOpportunities();
  const [q, setQ] = useState('');
  const [usage, setUsage] = useState('all');
  const [editing, setEditing] = useState<SkillOption | 'new' | null>(null);
  const [form, setForm] = useState({ name: '' });
  const [toDelete, setToDelete] = useState<SkillOption | null>(null);

  const usedBy = (name: string) => opps.filter((o) => o.skills.includes(name)).length;

  const filtered = useMemo(() => skills.filter((s) => {
    const used = usedBy(s.name);
    return (usage === 'all' || (usage === 'used' ? used > 0 : used === 0)) &&
      s.name.toLowerCase().includes(q.toLowerCase());
  }), [skills, q, usage, opps]);

  const openNew = () => { setForm({ name: '' }); setEditing('new'); };
  const openEdit = (s: SkillOption) => { setForm({ name: s.name }); setEditing(s); };

  const save = () => {
    const name = form.name.trim();
    if (!name) return toast.error('Please enter a skill name');
    const dup = skills.find((s) => s.name.toLowerCase() === name.toLowerCase() && (editing === 'new' || s.id !== (editing as SkillOption).id));
    if (dup) return toast.error('A skill with this name already exists');
    saveSkill({ id: editing === 'new' ? undefined : (editing as SkillOption).id, name, category: (editing !== 'new' ? (editing as SkillOption).category : '') || 'General' });
    setSkills(getSkills());
    setEditing(null);
    toast.success(editing === 'new' ? 'Skill created' : 'Skill updated');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-primary" />Skills Master</h1>
          <p className="text-muted-foreground text-sm">Manage the skills available when creating jobs & internships.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Create Skill</Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search skill name..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Select value={usage} onValueChange={setUsage}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All skills</SelectItem><SelectItem value="used">Used in opportunities</SelectItem><SelectItem value="unused">Not used yet</SelectItem></SelectContent></Select>
          </div>

          <Table>
            <TableHeader><TableRow>
              <TableHead>Skill</TableHead><TableHead>Category</TableHead><TableHead>Used In</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No skills found.</TableCell></TableRow>}
              {filtered.map((s) => {
                const used = usedBy(s.name);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell><Badge variant="secondary">{s.category}</Badge></TableCell>
                    <TableCell>{used > 0 ? <Badge variant="default">{used} {used === 1 ? 'opportunity' : 'opportunities'}</Badge> : <span className="text-muted-foreground text-sm">Not used</span>}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => setToDelete(s)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing === 'new' ? 'Create Skill' : 'Edit Skill'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Skill Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. JavaScript" /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Programming" list="skill-categories" />
              <datalist id="skill-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete "{toDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete && usedBy(toDelete.name) > 0
                ? `This skill is used in ${usedBy(toDelete.name)} opportunit${usedBy(toDelete.name) === 1 ? 'y' : 'ies'}. Deleting it here will not remove it from those opportunities, but it will no longer be offered when creating new ones.`
                : 'This skill will no longer be offered when creating jobs or internships.'}
            </AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { deleteSkill(toDelete!.id); setSkills(getSkills()); setToDelete(null); toast.success('Skill deleted'); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
