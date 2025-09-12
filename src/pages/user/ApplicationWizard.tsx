import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Save, Send, Check } from "lucide-react";
import { ApplicationField, FieldCategory } from "@/types/application";
import { masterFieldsData } from "@/data/masterFields";

const ApplicationWizard = () => {
  const { formId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Get course info from navigation state
  const courseInfo = location.state || {
    courseName: "Sample Course",
    universityName: "Sample University"
  };

  // Group fields by category for wizard steps
  const wizardSteps = [
    {
      title: "Personal Information",
      description: "Basic details about yourself",
      fields: masterFieldsData.fields.filter(f => f.categoryId === "personal"),
      icon: "👤"
    },
    {
      title: "Educational Background",
      description: "Your academic history",
      fields: masterFieldsData.fields.filter(f => f.categoryId === "education"),
      icon: "🎓"
    },
    {
      title: "Professional Experience",
      description: "Work and internship details",
      fields: masterFieldsData.fields.filter(f => f.categoryId === "professional"),
      icon: "💼"
    },
    {
      title: "Documents",
      description: "Upload required documents",
      fields: masterFieldsData.fields.filter(f => f.categoryId === "documents"),
      icon: "📄"
    },
    {
      title: "Additional Information",
      description: "Extra details and preferences",
      fields: masterFieldsData.fields.filter(f => f.categoryId === "additional"),
      icon: "ℹ️"
    },
    {
      title: "Review & Submit",
      description: "Review your application",
      fields: [],
      icon: "✅"
    }
  ];

  const currentStepData = wizardSteps[currentStep];
  const progress = ((currentStep + 1) / wizardSteps.length) * 100;

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveProgress = () => {
    // Save to localStorage for now
    const applicationData = {
      formId,
      courseInfo,
      formData,
      currentStep,
      completedSteps,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`application_${formId}`, JSON.stringify(applicationData));
    
    toast({
      title: "Progress Saved",
      description: "Your application has been saved. You can continue later.",
    });
  };

  const handleSubmit = () => {
    // Submit application
    const applicationData = {
      formId,
      courseInfo,
      formData,
      submittedAt: new Date().toISOString()
    };
    
    // Save to submitted applications
    const submissions = JSON.parse(localStorage.getItem("submitted_applications") || "[]");
    submissions.push(applicationData);
    localStorage.setItem("submitted_applications", JSON.stringify(submissions));
    
    // Clear draft
    localStorage.removeItem(`application_${formId}`);
    
    toast({
      title: "Application Submitted!",
      description: "Your application has been successfully submitted.",
    });
    
    navigate("/user/dashboard");
  };

  // Load saved progress if exists
  useEffect(() => {
    const savedData = localStorage.getItem(`application_${formId}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.formData || {});
      setCurrentStep(parsed.currentStep || 0);
      setCompletedSteps(parsed.completedSteps || []);
    }
  }, [formId]);

  const renderField = (field: ApplicationField) => {
    const value = formData[field.name] || "";
    
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "url":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              rows={4}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "select":
      case "country":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleInputChange(field.name, val)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup value={value} onValueChange={(val) => handleInputChange(field.name, val)}>
              {field.options?.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "checkbox":
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={value === true}
                onCheckedChange={(checked) => handleInputChange(field.name, checked)}
              />
              <Label htmlFor={field.id} className="font-normal">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </Label>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground ml-6">{field.description}</p>
            )}
          </div>
        );
        
      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type="file"
              onChange={(e) => handleInputChange(field.name, e.target.files?.[0]?.name || "")}
              required={field.required}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderReviewStep = () => {
    return (
      <div className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Application Summary</h3>
          <p className="text-sm text-muted-foreground">
            Course: {courseInfo.courseName}
          </p>
          <p className="text-sm text-muted-foreground">
            University: {courseInfo.universityName}
          </p>
        </div>
        
        {wizardSteps.slice(0, -1).map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span>{step.icon}</span>
                {step.title}
                {completedSteps.includes(index) && (
                  <Check className="h-4 w-4 text-primary ml-auto" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(index)}
              >
                Review Section
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <div className="flex items-center gap-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms" className="text-sm">
            I confirm that all information provided is accurate and complete.
          </Label>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Application Form</h1>
          <p className="text-muted-foreground">
            {courseInfo.courseName} - {courseInfo.universityName}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {wizardSteps.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveProgress}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {wizardSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  index === currentStep
                    ? "bg-primary/10 text-primary"
                    : completedSteps.includes(index)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <span className="text-2xl">{step.icon}</span>
                <span className="text-xs hidden sm:block">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{currentStepData.title}</CardTitle>
            <CardDescription>{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === wizardSteps.length - 1 ? (
              renderReviewStep()
            ) : (
              <div className="space-y-6">
                {currentStepData.fields.map(field => renderField(field))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === wizardSteps.length - 1 ? (
            <Button onClick={handleSubmit}>
              <Send className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationWizard;