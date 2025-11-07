import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CourseType } from "@/types/courseType";

interface AddEditCourseTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: Omit<CourseType, "id" | "createdAt" | "updatedAt">) => void;
  type?: CourseType;
}

const AddEditCourseTypeDialog = ({
  isOpen,
  onClose,
  onSave,
  type,
}: AddEditCourseTypeDialogProps) => {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    if (type) {
      setName(type.name);
      setShortName(type.shortName);
      setDescription(type.description || "");
      setKeywords(type.keywords || "");
    } else {
      setName("");
      setShortName("");
      setDescription("");
      setKeywords("");
    }
  }, [type, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortName.trim()) return;

    onSave({
      name: name.trim(),
      shortName: shortName.trim(),
      description: description.trim() || undefined,
      keywords: keywords.trim() || undefined,
      isActive: type?.isActive ?? true,
    });

    setName("");
    setShortName("");
    setDescription("");
    setKeywords("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{type ? "Edit Course Type" : "Add Course Type"}</DialogTitle>
          <DialogDescription>
            {type
              ? "Update the course type details below."
              : "Enter the details for the new course type."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Full Time"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortName">
                Short Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shortName"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g., FT"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the course type"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., full-time, regular, standard"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{type ? "Update" : "Add"} Course Type</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCourseTypeDialog;
