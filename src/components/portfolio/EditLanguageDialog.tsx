import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Language } from "@/types/portfolio";

interface EditLanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  onSave: (language: Omit<Language, 'id'>) => void;
  onDelete?: () => void;
}

export default function EditLanguageDialog({ open, onOpenChange, language, onSave, onDelete }: EditLanguageDialogProps) {
  const [formData, setFormData] = useState(language);

  const handleSave = () => {
    const { id, ...dataToSave } = formData;
    onSave(dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{language.id ? 'Edit' : 'Add'} Language</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Language</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. English"
            />
          </div>

          <div>
            <Label htmlFor="proficiency">Proficiency Level</Label>
            <Select value={formData.proficiency} onValueChange={(value: any) => setFormData({ ...formData, proficiency: value })}>
              <SelectTrigger id="proficiency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="native">Native</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <div>
            {onDelete && language.id && (
              <Button variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}