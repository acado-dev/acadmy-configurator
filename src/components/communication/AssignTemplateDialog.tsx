import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { CommunicationTemplate } from '@/types/communication';
import {
  UniversityOption,
  getUniversityOptions,
  templateAssignment,
} from '@/lib/communicationTemplates';

interface Props {
  template: CommunicationTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mode: 'all' | 'selected', universityIds: string[]) => void;
}

export function AssignTemplateDialog({ template, open, onOpenChange, onSave }: Props) {
  const [universities, setUniversities] = useState<UniversityOption[]>([]);
  const [mode, setMode] = useState<'all' | 'selected'>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open || !template) return;
    setUniversities(getUniversityOptions());
    const assignment = templateAssignment(template);
    setMode(assignment.mode);
    setSelected(assignment.universityIds);
    setSearch('');
  }, [open, template]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const filtered = universities.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign template to universities</DialogTitle>
          <DialogDescription>
            {template?.name} — choose which universities can use this template.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'all' | 'selected')}>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <RadioGroupItem value="all" id="assign-all" className="mt-1" />
              <div>
                <Label htmlFor="assign-all">All universities</Label>
                <p className="text-xs text-muted-foreground">
                  Every university on the platform gets this template.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <RadioGroupItem value="selected" id="assign-selected" className="mt-1" />
              <div>
                <Label htmlFor="assign-selected">Selected universities only</Label>
                <p className="text-xs text-muted-foreground">
                  Pick the universities that should see this template.
                </p>
              </div>
            </div>
          </RadioGroup>

          {mode === 'selected' && (
            <div className="space-y-2">
              <Input
                placeholder="Search universities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ScrollArea className="h-56 rounded-lg border p-2">
                {filtered.length === 0 ? (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                    No universities found.
                  </p>
                ) : (
                  filtered.map((u) => (
                    <label
                      key={u.id}
                      className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-accent/50"
                    >
                      <Checkbox
                        checked={selected.includes(u.id)}
                        onCheckedChange={() => toggle(u.id)}
                      />
                      <span className="text-sm">{u.name}</span>
                    </label>
                  ))
                )}
              </ScrollArea>
              <p className="text-xs text-muted-foreground">
                {selected.length} university{selected.length === 1 ? '' : 's'} selected
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(mode, mode === 'all' ? [] : selected)}>
            Save assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
