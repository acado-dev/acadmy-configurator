import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, FileText, ClipboardCheck, Video, Edit } from "lucide-react";
import { Scholarship, ScholarshipFormField, ScholarshipStage } from "@/types/scholarship";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface ScholarshipSelectionStepProps {
  scholarshipData: Partial<Scholarship>;
  setScholarshipData: (data: Partial<Scholarship>) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
  isEditMode: boolean;
}

const ScholarshipSelectionStep = ({
  scholarshipData,
  setScholarshipData,
  onNext,
  onBack,
  onSaveDraft,
}: ScholarshipSelectionStepProps) => {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<ScholarshipStage | null>(null);
  
  const [newFormField, setNewFormField] = useState<Partial<ScholarshipFormField>>({
    fieldType: "text",
    required: false,
  });

  const [newStage, setNewStage] = useState<Partial<ScholarshipStage>>({
    type: "screening",
    weightage: 25,
    autoScore: false,
    reviewers: [],
  });

  const stageTypeIcons = {
    screening: FileText,
    assessment: ClipboardCheck,
    interview: Video,
    assignment: Edit,
  };

  const addFormField = () => {
    if (!newFormField.label) {
      alert("Please enter a field label");
      return;
    }

    const field: ScholarshipFormField = {
      id: `field-${Date.now()}`,
      fieldType: newFormField.fieldType as any,
      label: newFormField.label,
      required: newFormField.required || false,
      placeholder: newFormField.placeholder,
      options: newFormField.options,
    };

    setScholarshipData({
      ...scholarshipData,
      formFields: [...(scholarshipData.formFields || []), field],
    });

    setNewFormField({ fieldType: "text", required: false });
    setFormDialogOpen(false);
  };

  const removeFormField = (id: string) => {
    setScholarshipData({
      ...scholarshipData,
      formFields: scholarshipData.formFields?.filter((f) => f.id !== id),
    });
  };

  const addStage = () => {
    if (!newStage.title) {
      alert("Please enter a stage title");
      return;
    }

    const stage: ScholarshipStage = {
      id: editingStage?.id || `stage-${Date.now()}`,
      type: newStage.type as any,
      title: newStage.title,
      description: newStage.description,
      order: editingStage?.order || (scholarshipData.stages?.length || 0) + 1,
      deadline: newStage.deadline,
      weightage: newStage.weightage || 25,
      autoScore: newStage.autoScore || false,
      reviewers: newStage.reviewers || [],
      passScore: newStage.passScore,
      createdAt: editingStage?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingStage) {
      setScholarshipData({
        ...scholarshipData,
        stages: scholarshipData.stages?.map((s) => (s.id === editingStage.id ? stage : s)),
      });
    } else {
      setScholarshipData({
        ...scholarshipData,
        stages: [...(scholarshipData.stages || []), stage],
      });
    }

    setNewStage({ type: "screening", weightage: 25, autoScore: false, reviewers: [] });
    setEditingStage(null);
    setStageDialogOpen(false);
  };

  const removeStage = (id: string) => {
    setScholarshipData({
      ...scholarshipData,
      stages: scholarshipData.stages?.filter((s) => s.id !== id),
    });
  };

  const handleNext = () => {
    if (!scholarshipData.formFields?.length) {
      alert("Please add at least one form field");
      return;
    }
    if (!scholarshipData.stages?.length) {
      alert("Please add at least one selection stage");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Application & Selection Setup</h2>
        <p className="text-muted-foreground">
          Configure the application form and selection stages
        </p>
      </div>

      {/* Application Form Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Application Form Fields</h3>
          <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Form Field</DialogTitle>
                <DialogDescription>
                  Add a new field to the application form
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Field Type</Label>
                  <Select
                    value={newFormField.fieldType}
                    onValueChange={(value: any) => setNewFormField({ ...newFormField, fieldType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Text Area</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Field Label</Label>
                  <Input
                    placeholder="e.g., Resume, Statement of Purpose"
                    value={newFormField.label || ""}
                    onChange={(e) => setNewFormField({ ...newFormField, label: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Placeholder (optional)</Label>
                  <Input
                    placeholder="e.g., Enter your answer here"
                    value={newFormField.placeholder || ""}
                    onChange={(e) => setNewFormField({ ...newFormField, placeholder: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    checked={newFormField.required}
                    onCheckedChange={(checked) => setNewFormField({ ...newFormField, required: checked as boolean })}
                  />
                  <Label htmlFor="required" className="cursor-pointer">
                    Required field
                  </Label>
                </div>

                <Button onClick={addFormField} className="w-full">
                  Add Field
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {scholarshipData.formFields?.map((field) => (
            <Card key={field.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{field.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {field.fieldType} {field.required && "• Required"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFormField(field.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {!scholarshipData.formFields?.length && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No form fields added yet. Click "Add Field" to get started.
            </p>
          )}
        </div>
      </div>

      {/* Selection Stages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Selection Stages</h3>
          <Dialog open={stageDialogOpen} onOpenChange={setStageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Stage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingStage ? "Edit Stage" : "Add Selection Stage"}</DialogTitle>
                <DialogDescription>
                  Configure a selection stage for the scholarship
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Stage Type</Label>
                  <Select
                    value={newStage.type}
                    onValueChange={(value: any) => setNewStage({ ...newStage, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="screening">Screening (Document Review)</SelectItem>
                      <SelectItem value="assessment">Assessment (MCQ/Subjective)</SelectItem>
                      <SelectItem value="interview">Interview (Live Video)</SelectItem>
                      <SelectItem value="assignment">Assignment (Task Submission)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Stage Title</Label>
                  <Input
                    placeholder="e.g., Initial Screening"
                    value={newStage.title || ""}
                    onChange={(e) => setNewStage({ ...newStage, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea
                    placeholder="Describe what this stage involves"
                    value={newStage.description || ""}
                    onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Deadline (optional)</Label>
                    <Input
                      type="date"
                      value={newStage.deadline || ""}
                      onChange={(e) => setNewStage({ ...newStage, deadline: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weightage (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 25"
                      value={newStage.weightage || ""}
                      onChange={(e) => setNewStage({ ...newStage, weightage: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pass Score (optional)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 70"
                    value={newStage.passScore || ""}
                    onChange={(e) => setNewStage({ ...newStage, passScore: Number(e.target.value) })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoScore"
                    checked={newStage.autoScore}
                    onCheckedChange={(checked) => setNewStage({ ...newStage, autoScore: checked as boolean })}
                  />
                  <Label htmlFor="autoScore" className="cursor-pointer">
                    Auto-score (for MCQ assessments)
                  </Label>
                </div>

                <Button onClick={addStage} className="w-full">
                  {editingStage ? "Update Stage" : "Add Stage"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {scholarshipData.stages?.map((stage) => {
            const Icon = stageTypeIcons[stage.type];
            return (
              <Card key={stage.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{stage.title}</CardTitle>
                        <CardDescription className="capitalize">
                          {stage.type.replace("_", " ")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingStage(stage);
                          setNewStage(stage);
                          setStageDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStage(stage.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stage.description && (
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Weightage: {stage.weightage}%</Badge>
                    {stage.autoScore && <Badge variant="outline">Auto-score</Badge>}
                    {stage.passScore && <Badge variant="outline">Pass: {stage.passScore}</Badge>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {!scholarshipData.stages?.length && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No selection stages added yet. Click "Add Stage" to get started.
          </p>
        )}
      </div>

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
        <Button onClick={handleNext}>
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default ScholarshipSelectionStep;
