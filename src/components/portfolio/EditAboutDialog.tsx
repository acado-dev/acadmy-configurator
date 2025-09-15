import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EditAboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  about: string;
  onSave: (about: string) => void;
}

export default function EditAboutDialog({ open, onOpenChange, about, onSave }: EditAboutDialogProps) {
  const [aboutText, setAboutText] = useState(about);

  const handleSave = () => {
    onSave(aboutText);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit About</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}