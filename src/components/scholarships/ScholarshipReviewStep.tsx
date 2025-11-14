import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Award, Calendar, DollarSign, Users, FileText, ClipboardCheck } from "lucide-react";
import { Scholarship } from "@/types/scholarship";
import { Separator } from "@/components/ui/separator";

interface ScholarshipReviewStepProps {
  scholarshipData: Partial<Scholarship>;
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isEditMode: boolean;
}

const ScholarshipReviewStep = ({
  scholarshipData,
  onBack,
  onSaveDraft,
  onPublish,
}: ScholarshipReviewStepProps) => {
  const isValid = {
    title: !!scholarshipData.title,
    provider: !!scholarshipData.providerName,
    amount: !!scholarshipData.amount,
    deadline: !!scholarshipData.applicationDeadline,
    description: !!scholarshipData.description,
    formFields: (scholarshipData.formFields?.length || 0) > 0,
    stages: (scholarshipData.stages?.length || 0) > 0,
  };

  const canPublish = Object.values(isValid).every((v) => v);

  const ChecklistItem = ({ label, checked }: { label: string; checked: boolean }) => (
    <div className="flex items-center gap-2">
      {checked ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 text-destructive" />
      )}
      <span className={checked ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Publish</h2>
        <p className="text-muted-foreground">
          Review your scholarship details before publishing
        </p>
      </div>

      {/* Publish Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Publish Checklist</CardTitle>
          <CardDescription>
            Ensure all required fields are completed before publishing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ChecklistItem label="Scholarship title provided" checked={isValid.title} />
          <ChecklistItem label="Provider/Organization specified" checked={isValid.provider} />
          <ChecklistItem label="Amount/Value set" checked={isValid.amount} />
          <ChecklistItem label="Application deadline set" checked={isValid.deadline} />
          <ChecklistItem label="Description added" checked={isValid.description} />
          <ChecklistItem
            label="At least one application form field"
            checked={isValid.formFields}
          />
          <ChecklistItem
            label="At least one selection stage"
            checked={isValid.stages}
          />
          
          <Separator className="my-4" />
          
          {canPublish ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Ready to publish!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Please complete all required fields</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scholarship Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Scholarship Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">{scholarshipData.title || "Untitled Scholarship"}</p>
                <p className="text-sm text-muted-foreground">
                  by {scholarshipData.providerName || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">
                  {scholarshipData.currency} {scholarshipData.amount?.toLocaleString() || "0"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {scholarshipData.type?.replace("_", " ")} • {scholarshipData.numberOfAwards || 1} award(s)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">
                  {scholarshipData.applicationDeadline
                    ? new Date(scholarshipData.applicationDeadline).toLocaleDateString()
                    : "No deadline set"}
                </p>
                <p className="text-sm text-muted-foreground">Application deadline</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold capitalize">
                  {scholarshipData.studyLevel?.replace("_", " ") || "Any level"}
                </p>
                <p className="text-sm text-muted-foreground">Study level</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags & Fields */}
          <div className="space-y-3">
            {scholarshipData.categoryTags && scholarshipData.categoryTags.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {scholarshipData.categoryTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {scholarshipData.fieldsOfStudy && scholarshipData.fieldsOfStudy.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Fields of Study</p>
                <div className="flex flex-wrap gap-2">
                  {scholarshipData.fieldsOfStudy.map((field) => (
                    <Badge key={field} variant="outline">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Form Fields */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-primary" />
              <p className="font-semibold">
                Application Form ({scholarshipData.formFields?.length || 0} fields)
              </p>
            </div>
            <div className="space-y-2">
              {scholarshipData.formFields?.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-2 rounded bg-muted/50"
                >
                  <span className="text-sm">{field.label}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {field.fieldType}
                    </Badge>
                    {field.required && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Selection Stages */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              <p className="font-semibold">
                Selection Process ({scholarshipData.stages?.length || 0} stages)
              </p>
            </div>
            <div className="space-y-2">
              {scholarshipData.stages?.map((stage, index) => (
                <div
                  key={stage.id}
                  className="flex items-center justify-between p-3 rounded border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{stage.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {stage.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Weightage: {stage.weightage}%</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
        <Button onClick={onPublish} disabled={!canPublish}>
          Publish Scholarship
        </Button>
      </div>
    </div>
  );
};

export default ScholarshipReviewStep;
