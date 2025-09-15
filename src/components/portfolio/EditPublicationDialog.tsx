import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Publication } from "@/types/portfolio";

interface EditPublicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publication: Publication;
  onSave: (publication: Omit<Publication, 'id'>) => void;
}

export default function EditPublicationDialog({ open, onOpenChange, publication, onSave }: EditPublicationDialogProps) {
  const [formData, setFormData] = useState(publication);
  const [authorInput, setAuthorInput] = useState('');

  const handleAddAuthor = () => {
    if (authorInput.trim()) {
      setFormData({ ...formData, authors: [...formData.authors, authorInput.trim()] });
      setAuthorInput('');
    }
  };

  const handleRemoveAuthor = (index: number) => {
    setFormData({ 
      ...formData, 
      authors: formData.authors.filter((_, i) => i !== index) 
    });
  };

  const handleSave = () => {
    const { id, ...dataToSave } = formData;
    onSave(dataToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{publication.id ? 'Edit' : 'Add'} Publication</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Publication Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Research on Machine Learning"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="e.g. IEEE"
              />
            </div>
            <div>
              <Label htmlFor="publicationDate">Publication Date</Label>
              <Input
                id="publicationDate"
                type="month"
                value={formData.publicationDate}
                onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="authors">Authors</Label>
            <div className="flex gap-2">
              <Input
                id="authors"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                placeholder="Add author..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAuthor())}
              />
              <Button type="button" onClick={handleAddAuthor}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.authors.map((author, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {author}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveAuthor(index)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="link">Publication Link</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the publication..."
              rows={3}
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