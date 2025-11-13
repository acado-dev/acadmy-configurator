import { CheckCircle2, XCircle, AlertCircle, ExternalLink, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Event } from "@/types/event";

interface EventReviewStepProps {
  eventData: Partial<Event>;
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isEditMode?: boolean;
}

const EventReviewStep = ({ eventData, onBack, onSaveDraft, onPublish }: EventReviewStepProps) => {
  const checklist = [
    {
      label: "Event logo uploaded",
      completed: !!eventData.logo,
      required: false,
    },
    {
      label: "Event title entered",
      completed: !!eventData.title,
      required: true,
    },
    {
      label: "Description added",
      completed: !!eventData.description,
      required: true,
    },
    {
      label: "Registration dates set",
      completed: !!(eventData.registrationStartDate && eventData.registrationEndDate),
      required: true,
    },
    {
      label: "Event date and time set",
      completed: !!(eventData.eventDate && eventData.eventTime),
      required: true,
    },
    {
      label: "At least one stage added",
      completed: !!(eventData.stages && eventData.stages.length > 0),
      required: true,
    },
  ];

  const canPublish = checklist.filter((item) => item.required).every((item) => item.completed);
  const completedCount = checklist.filter((item) => item.completed).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Review & Publish</h2>
        <p className="text-muted-foreground">
          Review your event details before publishing
        </p>
      </div>

      {/* Publish Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Publish Checklist</CardTitle>
          <CardDescription>
            {completedCount} of {checklist.length} items completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
              ) : item.required ? (
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
              )}
              <span className={item.completed ? "text-foreground" : "text-muted-foreground"}>
                {item.label}
                {item.required && !item.completed && (
                  <Badge variant="destructive" className="ml-2 text-xs">
                    Required
                  </Badge>
                )}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Event Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Summary of your event</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              Basic Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title:</span>
                <span className="font-medium">{eventData.title || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conducted By:</span>
                <span className="font-medium">{eventData.conductedBy || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Domain:</span>
                <span className="font-medium">{eventData.functionalDomain || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode:</span>
                <Badge variant="outline" className="capitalize">
                  {eventData.mode || "online"}
                </Badge>
              </div>
              {eventData.categoryTags && eventData.categoryTags.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Tags:</span>
                  <div className="flex flex-wrap gap-1 max-w-[60%] justify-end">
                    {eventData.categoryTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Schedule */}
          <div>
            <h4 className="font-semibold mb-3">Schedule</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registration Opens:</span>
                <span className="font-medium">
                  {eventData.registrationStartDate
                    ? new Date(eventData.registrationStartDate).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registration Closes:</span>
                <span className="font-medium">
                  {eventData.registrationEndDate
                    ? new Date(eventData.registrationEndDate).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Event Date:</span>
                <span className="font-medium">
                  {eventData.eventDate
                    ? new Date(eventData.eventDate).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Event Time:</span>
                <span className="font-medium">{eventData.eventTime || "—"}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-3">Description</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {eventData.description || "No description provided"}
            </p>
          </div>

          <Separator />

          {/* Stages */}
          <div>
            <h4 className="font-semibold mb-3">
              Event Stages ({eventData.stages?.length || 0})
            </h4>
            {eventData.stages && eventData.stages.length > 0 ? (
              <div className="space-y-2">
                {eventData.stages
                  .sort((a, b) => a.order - b.order)
                  .map((stage, index) => (
                    <div
                      key={stage.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{stage.title}</span>
                          <Badge
                            variant={stage.status === "ready" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {stage.status}
                          </Badge>
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="capitalize">{stage.type.replace("_", " ")}</span>
                          {stage.duration && <span>• {stage.duration} mins</span>}
                          {stage.points && <span>• {stage.points} pts</span>}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No stages added</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Eligibility & Registration Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-sm">Eligibility</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {eventData.eligibility?.type || "everyone"}
              </Badge>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm">Registration</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {eventData.registrationSettings?.approval || "auto"} approval
              </Badge>
              {eventData.registrationSettings?.enableWaitlist && (
                <Badge variant="secondary">Waitlist enabled</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning if can't publish */}
      {!canPublish && (
        <Card className="border-warning bg-warning-light">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Cannot publish yet</h4>
                <p className="text-sm text-muted-foreground">
                  Please complete all required items in the checklist above before publishing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
        <Button onClick={onPublish} disabled={!canPublish} className="gap-2">
          Publish Event
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EventReviewStep;
