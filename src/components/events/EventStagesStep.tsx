import { useState } from "react";
import {
  FileText,
  Video,
  BookOpen,
  Radio,
  Upload,
  GripVertical,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event, EventStage, StageType } from "@/types/event";
import { toast } from "@/hooks/use-toast";

interface EventStagesStepProps {
  eventData: Partial<Event>;
  setEventData: (data: Partial<Event>) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
  isEditMode?: boolean;
}

const stageTypeOptions = [
  {
    type: "assessment" as StageType,
    title: "Assessment",
    description: "MCQ or Subjective tests",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    type: "submission" as StageType,
    title: "File Submission",
    description: "Assignment uploads",
    icon: Upload,
    color: "text-green-500",
  },
  {
    type: "video" as StageType,
    title: "Video Session",
    description: "Recorded or live videos",
    icon: Video,
    color: "text-purple-500",
  },
  {
    type: "notes" as StageType,
    title: "Notes / Info",
    description: "Reading material",
    icon: BookOpen,
    color: "text-orange-500",
  },
  {
    type: "live_session" as StageType,
    title: "Live Session",
    description: "Interactive sessions",
    icon: Radio,
    color: "text-red-500",
  },
];

const EventStagesStep = ({
  eventData,
  setEventData,
  onNext,
  onBack,
  onSaveDraft,
}: EventStagesStepProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<EventStage | null>(null);
  const [stageForm, setStageForm] = useState<Partial<EventStage>>({
    status: "draft",
  });

  const handleAddStage = (type: StageType) => {
    setStageForm({
      type,
      status: "draft",
      order: (eventData.stages?.length || 0) + 1,
    });
    setEditingStage(null);
    setDialogOpen(true);
  };

  const handleEditStage = (stage: EventStage) => {
    setStageForm(stage);
    setEditingStage(stage);
    setDialogOpen(true);
  };

  const handleSaveStage = () => {
    if (!stageForm.title) {
      toast({
        title: "Error",
        description: "Please enter a stage title",
        variant: "destructive",
      });
      return;
    }

    const newStage: EventStage = {
      ...stageForm,
      id: editingStage?.id || `stage-${Date.now()}`,
      createdAt: editingStage?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as EventStage;

    let updatedStages = [...(eventData.stages || [])];

    if (editingStage) {
      const index = updatedStages.findIndex((s) => s.id === editingStage.id);
      if (index !== -1) {
        updatedStages[index] = newStage;
      }
    } else {
      updatedStages.push(newStage);
    }

    setEventData({ ...eventData, stages: updatedStages });
    setDialogOpen(false);
    setStageForm({ status: "draft" });
    toast({
      title: editingStage ? "Stage updated" : "Stage added",
      description: `${newStage.title} has been ${editingStage ? "updated" : "added"}.`,
    });
  };

  const handleDeleteStage = (stageId: string) => {
    const updatedStages = eventData.stages?.filter((s) => s.id !== stageId);
    setEventData({ ...eventData, stages: updatedStages });
    toast({
      title: "Stage deleted",
      description: "The stage has been removed.",
    });
  };

  const handleReorderStage = (stageId: string, direction: "up" | "down") => {
    const stages = [...(eventData.stages || [])];
    const index = stages.findIndex((s) => s.id === stageId);
    
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === stages.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    [stages[index], stages[newIndex]] = [stages[newIndex], stages[index]];
    
    // Update order numbers
    stages.forEach((stage, i) => {
      stage.order = i + 1;
    });

    setEventData({ ...eventData, stages });
  };

  const getStageIcon = (type: StageType) => {
    const option = stageTypeOptions.find((o) => o.type === type);
    return option ? <option.icon className={`h-5 w-5 ${option.color}`} /> : null;
  };

  const isValid = () => {
    return eventData.stages && eventData.stages.length > 0;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Add Event Stages</h2>
        <p className="text-muted-foreground">
          Build your event journey with different types of activities
        </p>
      </div>

      {/* Stage Type Cards */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Select Stage Type
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stageTypeOptions.map((option) => (
            <Card
              key={option.type}
              className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
              onClick={() => handleAddStage(option.type)}
            >
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <option.icon className={`h-10 w-10 ${option.color}`} />
                </div>
                <h4 className="font-semibold mb-1">{option.title}</h4>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stages List */}
      {eventData.stages && eventData.stages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Event Stages ({eventData.stages.length})
            </h3>
          </div>
          <div className="space-y-3">
            {eventData.stages
              .sort((a, b) => a.order - b.order)
              .map((stage, index) => (
                <Card key={stage.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleReorderStage(stage.id, "up")}
                          disabled={index === 0}
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                          {getStageIcon(stage.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{stage.title}</h4>
                            <Badge
                              variant={stage.status === "ready" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {stage.status}
                            </Badge>
                          </div>
                          {stage.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {stage.description}
                            </p>
                          )}
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            {stage.duration && <span>{stage.duration} mins</span>}
                            {stage.points && <span>{stage.points} points</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStage(stage)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStage(stage.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {eventData.stages && eventData.stages.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Plus className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-center">
              No stages added yet. Select a stage type above to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stage Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStage ? "Edit Stage" : "Add New Stage"}
            </DialogTitle>
            <DialogDescription>
              Configure the stage details and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stageTitle">Stage Title *</Label>
              <Input
                id="stageTitle"
                placeholder="e.g., Introduction Assessment"
                value={stageForm.title || ""}
                onChange={(e) =>
                  setStageForm({ ...stageForm, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stageDescription">Description</Label>
              <Textarea
                id="stageDescription"
                placeholder="Describe this stage..."
                rows={3}
                value={stageForm.description || ""}
                onChange={(e) =>
                  setStageForm({ ...stageForm, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={stageForm.duration || ""}
                  onChange={(e) =>
                    setStageForm({ ...stageForm, duration: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  placeholder="100"
                  value={stageForm.points || ""}
                  onChange={(e) =>
                    setStageForm({ ...stageForm, points: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={stageForm.startDate || ""}
                  onChange={(e) =>
                    setStageForm({ ...stageForm, startDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={stageForm.endDate || ""}
                  onChange={(e) =>
                    setStageForm({ ...stageForm, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={stageForm.status}
                onValueChange={(value: any) =>
                  setStageForm({ ...stageForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStage}>
              {editingStage ? "Update" : "Add"} Stage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button variant="outline" onClick={onSaveDraft}>
            Save Draft
          </Button>
        </div>
        <Button onClick={onNext} disabled={!isValid()}>
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default EventStagesStep;
