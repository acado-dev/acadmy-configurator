import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { LearningOutcome } from '@/types/learningOutcome';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LearningOutcomeAssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (outcomeIds: string[]) => void;
  assignedOutcomeIds: string[];
  availableOutcomes: LearningOutcome[];
  courseName: string;
}

const LearningOutcomeAssignDialog: React.FC<LearningOutcomeAssignDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  assignedOutcomeIds,
  availableOutcomes,
  courseName,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(assignedOutcomeIds);
    }
  }, [assignedOutcomeIds, isOpen]);

  const handleToggle = (outcomeId: string) => {
    setSelectedIds(prev =>
      prev.includes(outcomeId)
        ? prev.filter(id => id !== outcomeId)
        : [...prev, outcomeId]
    );
  };

  const handleSubmit = () => {
    onSave(selectedIds);
    onClose();
  };

  const renderOutcomeTree = (outcomes: LearningOutcome[], parentId: string | null = null, level = 0) => {
    const filteredOutcomes = outcomes.filter(o => o.parentId === parentId && o.isActive);
    
    return filteredOutcomes.map(outcome => (
      <div key={outcome.id} style={{ marginLeft: `${level * 24}px` }}>
        <div className="flex items-center space-x-2 py-2">
          <Checkbox
            id={outcome.id}
            checked={selectedIds.includes(outcome.id)}
            onCheckedChange={() => handleToggle(outcome.id)}
          />
          <Label
            htmlFor={outcome.id}
            className="text-sm font-normal cursor-pointer flex-1"
          >
            {outcome.name} {outcome.code && `(${outcome.code})`}
          </Label>
        </div>
        {renderOutcomeTree(outcomes, outcome.id, level + 1)}
      </div>
    ));
  };

  const activeOutcomes = availableOutcomes.filter(o => o.isActive);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Learning Outcomes - {courseName}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-1">
            {activeOutcomes.length > 0 ? (
              renderOutcomeTree(activeOutcomes)
            ) : (
              <p className="text-muted-foreground text-sm">No learning outcomes available</p>
            )}
          </div>
        </ScrollArea>

        <div className="text-sm text-muted-foreground">
          {selectedIds.length} learning outcome(s) selected
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LearningOutcomeAssignDialog;
