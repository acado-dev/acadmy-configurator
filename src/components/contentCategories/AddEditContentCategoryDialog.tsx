import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { WallCategory } from "@/types/wallCategory";
import { Upload } from "lucide-react";

interface AddEditContentCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<WallCategory, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
  category?: WallCategory;
}

export default function AddEditContentCategoryDialog({
  isOpen,
  onClose,
  onSave,
  category,
}: AddEditContentCategoryDialogProps) {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("English");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [defaultImage, setDefaultImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setLanguage(category.language);
      setTagline(category.tagline || "");
      setDescription(category.description || "");
      setDefaultImage(category.defaultImage || "");
      setCoverImage(category.coverImage || "");
      setIsActive(category.isActive);
    } else {
      setName("");
      setLanguage("English");
      setTagline("");
      setDescription("");
      setDefaultImage("");
      setCoverImage("");
      setIsActive(true);
    }
  }, [category, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSave({
      ...(category && { id: category.id }),
      name: name.trim(),
      language,
      tagline: tagline.trim(),
      description: description.trim(),
      defaultImage,
      coverImage,
      isActive,
    });

    onClose();
  };

  const handleDefaultImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDefaultImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Community" : "Create Community"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter name.."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              placeholder="Enter Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter Description.."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Default Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-muted rounded flex items-center justify-center overflow-hidden">
                  {defaultImage ? (
                    <img src={defaultImage} alt="Default" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <label className="cursor-pointer">
                  <span className="text-sm text-primary flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    Browse to update
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDefaultImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-muted rounded flex items-center justify-center overflow-hidden">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <label className="cursor-pointer">
                  <span className="text-sm text-primary flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    Browse to update
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status (Active / Inactive)</Label>
            <div className="flex items-center gap-3">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <span className="text-sm text-muted-foreground">
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-8"
          >
            Submit
          </Button>
          <Button variant="outline" onClick={onClose} className="px-8">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
