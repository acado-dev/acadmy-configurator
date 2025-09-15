import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Volunteering } from "@/types/portfolio";

interface EditVolunteeringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  volunteering: Volunteering;
  onSave: (volunteering: Omit<Volunteering, 'id'>) => void;
}

export default function EditVolunteeringDialog({ open, onOpenChange, volunteering, onSave }: EditVolunteeringDialogProps) {
  const [formData, setFormData] = useState(volunteering);

  const handleSave = () => {
    const { id, ...dataToSave } = formData;
    onSave(dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{volunteering.id ? 'Edit' : 'Add'} Volunteering</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Volunteer Teacher"
              />
            </div>
            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Red Cross"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cause">Cause</Label>
            <Input
              id="cause"
              value={formData.cause}
              onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
              placeholder="e.g. Education, Healthcare"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={formData.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="current"
              checked={formData.current}
              onCheckedChange={(checked) => setFormData({ ...formData, current: checked })}
            />
            <Label htmlFor="current">I currently volunteer here</Label>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your volunteering activities and impact..."
              rows={4}
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