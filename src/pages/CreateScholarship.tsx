import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Scholarship } from "@/types/scholarship";
import ScholarshipDetailsStep from "@/components/scholarships/ScholarshipDetailsStep";
import ScholarshipSelectionStep from "@/components/scholarships/ScholarshipSelectionStep";
import ScholarshipReviewStep from "@/components/scholarships/ScholarshipReviewStep";

const CreateScholarship = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [scholarshipData, setScholarshipData] = useState<Partial<Scholarship>>({
    status: "draft",
    categoryTags: [],
    fieldsOfStudy: [],
    currency: "USD",
    numberOfAwards: 1,
    mode: "online",
    formFields: [],
    stages: [],
    visibility: "public",
    studyLevel: "any",
    type: "merit",
  });

  useEffect(() => {
    if (isEditMode) {
      const scholarships = JSON.parse(localStorage.getItem("scholarships") || "[]");
      const scholarship = scholarships.find((s: Scholarship) => s.id === id);
      if (scholarship) {
        setScholarshipData(scholarship);
      }
    }
  }, [id, isEditMode]);

  const steps = [
    { number: 1, title: "Scholarship Details", component: ScholarshipDetailsStep },
    { number: 2, title: "Application & Selection", component: ScholarshipSelectionStep },
    { number: 3, title: "Review & Publish", component: ScholarshipReviewStep },
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
    const scholarships = JSON.parse(localStorage.getItem("scholarships") || "[]");
    
    const updatedScholarship: Scholarship = {
      ...scholarshipData,
      id: scholarshipData.id || `scholarship-${Date.now()}`,
      status: "draft",
      updatedAt: new Date().toISOString(),
      createdAt: scholarshipData.createdAt || new Date().toISOString(),
      createdBy: "admin",
    } as Scholarship;

    if (isEditMode) {
      const index = scholarships.findIndex((s: Scholarship) => s.id === id);
      if (index !== -1) {
        scholarships[index] = updatedScholarship;
      }
    } else {
      scholarships.push(updatedScholarship);
    }

    localStorage.setItem("scholarships", JSON.stringify(scholarships));
    toast({
      title: "Draft saved",
      description: "Your scholarship has been saved as draft.",
    });
  };

  const handlePublish = () => {
    const scholarships = JSON.parse(localStorage.getItem("scholarships") || "[]");
    
    const publishedScholarship: Scholarship = {
      ...scholarshipData,
      id: scholarshipData.id || `scholarship-${Date.now()}`,
      status: "active",
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: scholarshipData.createdAt || new Date().toISOString(),
      createdBy: "admin",
    } as Scholarship;

    if (isEditMode) {
      const index = scholarships.findIndex((s: Scholarship) => s.id === id);
      if (index !== -1) {
        scholarships[index] = publishedScholarship;
      }
    } else {
      scholarships.push(publishedScholarship);
    }

    localStorage.setItem("scholarships", JSON.stringify(scholarships));
    toast({
      title: "Scholarship published",
      description: "Your scholarship is now live and accepting applications.",
    });
    navigate("/scholarships");
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
              onClick={() => navigate("/scholarships")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isEditMode ? "Edit Scholarship" : "Create New Scholarship"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditMode ? "Update scholarship details" : "Set up your scholarship in 3 simple steps"}
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
              scholarshipData={scholarshipData}
              setScholarshipData={setScholarshipData}
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

export default CreateScholarship;
