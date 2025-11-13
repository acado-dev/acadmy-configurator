import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Event } from "@/types/event";
import EventDetailsStep from "@/components/events/EventDetailsStep";
import EventStagesStep from "@/components/events/EventStagesStep";
import EventReviewStep from "@/components/events/EventReviewStep";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState<Partial<Event>>({
    status: "draft",
    categoryTags: [],
    skills: [],
    isPopular: false,
    mode: "online",
    stages: [],
    eligibility: {
      type: "everyone",
      genderRestriction: "all",
    },
    registrationSettings: {
      approval: "auto",
      enableWaitlist: false,
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const events = JSON.parse(localStorage.getItem("events") || "[]");
      const event = events.find((e: Event) => e.id === id);
      if (event) {
        setEventData(event);
      }
    }
  }, [id, isEditMode]);

  const steps = [
    { number: 1, title: "Event Details", component: EventDetailsStep },
    { number: 2, title: "Add Stages", component: EventStagesStep },
    { number: 3, title: "Review & Publish", component: EventReviewStep },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    
    const updatedEvent: Event = {
      ...eventData,
      id: eventData.id || `event-${Date.now()}`,
      status: "draft",
      updatedAt: new Date().toISOString(),
      createdAt: eventData.createdAt || new Date().toISOString(),
      createdBy: "admin",
    } as Event;

    if (isEditMode) {
      const index = events.findIndex((e: Event) => e.id === id);
      if (index !== -1) {
        events[index] = updatedEvent;
      }
    } else {
      events.push(updatedEvent);
    }

    localStorage.setItem("events", JSON.stringify(events));
    toast({
      title: "Draft saved",
      description: "Your event has been saved as draft.",
    });
  };

  const handlePublish = () => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    
    const publishedEvent: Event = {
      ...eventData,
      id: eventData.id || `event-${Date.now()}`,
      status: "active",
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: eventData.createdAt || new Date().toISOString(),
      createdBy: "admin",
    } as Event;

    if (isEditMode) {
      const index = events.findIndex((e: Event) => e.id === id);
      if (index !== -1) {
        events[index] = publishedEvent;
      }
    } else {
      events.push(publishedEvent);
    }

    localStorage.setItem("events", JSON.stringify(events));
    toast({
      title: "Event published",
      description: "Your event is now live and visible to learners.",
    });
    navigate("/events");
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-background-secondary">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/events")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isEditMode ? "Edit Event" : "Create New Event"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditMode ? "Update your event details" : "Set up your event in 3 simple steps"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep > step.number
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium mt-2 ${
                      currentStep >= step.number
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-4 ${
                      currentStep > step.number ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <Card className="max-w-5xl mx-auto">
          <CardContent className="p-8">
            <CurrentStepComponent
              eventData={eventData}
              setEventData={setEventData}
              onNext={handleNext}
              onBack={handleBack}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              isEditMode={isEditMode}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEvent;
