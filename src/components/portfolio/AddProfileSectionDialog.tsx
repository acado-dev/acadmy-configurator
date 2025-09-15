import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Briefcase, GraduationCap, Code, Award, BookOpen, Heart, Languages } from "lucide-react";

interface AddProfileSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSection: (section: string) => void;
}

const sections = [
  { id: 'about', label: 'About', description: 'Few lines about you', icon: User },
  { id: 'experience', label: 'Experience', description: 'Add your working experience', icon: Briefcase },
  { id: 'education', label: 'Education', description: 'Add your educational background', icon: GraduationCap },
  { id: 'projects', label: 'Projects', description: 'Add your project details', icon: Code },
  { id: 'certifications', label: 'Certifications', description: 'Add some of your certification details', icon: Award },
  { id: 'publications', label: 'Publications', description: 'Add your Publications', icon: BookOpen },
  { id: 'volunteering', label: 'Volunteering', description: 'Add your volunteering experience', icon: Heart },
  { id: 'skills', label: 'Skills', description: 'Add your Skills', icon: Code },
  { id: 'languages', label: 'Languages', description: 'Add languages you know', icon: Languages },
];

export default function AddProfileSectionDialog({ open, onOpenChange, onAddSection }: AddProfileSectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Profile Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{section.label}</h4>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <Button onClick={() => onAddSection(section.id)} variant="secondary">
                  Add
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}