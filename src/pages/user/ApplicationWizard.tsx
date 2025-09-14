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
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Send, 
  Check, 
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Home,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Globe,
  Award,
  Building,
  Languages,
  Target,
  Info,
  Upload,
  CheckCircle2
} from "lucide-react";
import { ApplicationField } from "@/types/application";
import { masterFields } from "@/data/masterFields";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const ApplicationWizard = () => {
  const { formId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get course info from navigation state
  const courseInfo = location.state || {
    courseName: "Sample Course",
    universityName: "Sample University"
  };

  // More granular wizard steps with better grouping
  const wizardSteps = [
    {
      id: "basic-info",
      title: "Basic Information",
      subtitle: "Let's start with your personal details",
      icon: User,
      fields: masterFields.filter(f => 
        f.categoryId === "personal" && 
        ["firstName", "lastName", "email", "phone"].includes(f.name)
      ),
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "contact-info",
      title: "Contact Details",
      subtitle: "How can we reach you",
      icon: Home,
      fields: masterFields.filter(f => 
        f.categoryId === "personal" && 
        ["address", "city", "country", "postalCode"].includes(f.name)
      ),
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: "personal-details",
      title: "Personal Profile",
      subtitle: "Tell us more about yourself",
      icon: User,
      fields: masterFields.filter(f => 
        f.categoryId === "personal" && 
        ["dateOfBirth", "nationality", "gender", "passportNumber"].includes(f.name)
      ),
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "current-education",
      title: "Current Education",
      subtitle: "Your most recent academic qualification",
      icon: GraduationCap,
      fields: masterFields.filter(f => 
        f.categoryId === "education" && 
        ["currentDegree", "institution", "graduationDate", "gpa"].includes(f.name)
      ),
      color: "from-green-500 to-green-600"
    },
    {
      id: "academic-history",
      title: "Academic Background",
      subtitle: "Previous educational achievements",
      icon: Award,
      fields: masterFields.filter(f => 
        f.categoryId === "education" && 
        ["previousDegrees", "academicAchievements", "researchExperience"].includes(f.name)
      ),
      color: "from-emerald-500 to-emerald-600"
    },
    {
      id: "work-experience",
      title: "Professional Experience",
      subtitle: "Your work and internship history",
      icon: Briefcase,
      fields: masterFields.filter(f => 
        f.categoryId === "professional" && 
        ["currentEmployment", "workExperience", "internships"].includes(f.name)
      ),
      color: "from-orange-500 to-orange-600"
    },
    {
      id: "skills",
      title: "Skills & Languages",
      subtitle: "Your competencies and language proficiency",
      icon: Languages,
      fields: masterFields.filter(f => 
        f.categoryId === "professional" && 
        ["skills", "languages", "certifications"].includes(f.name)
      ),
      color: "from-red-500 to-red-600"
    },
    {
      id: "test-scores",
      title: "Test Scores",
      subtitle: "Standardized test results",
      icon: FileText,
      fields: masterFields.filter(f => 
        f.categoryId === "documents" && 
        ["ieltsScore", "toeflScore", "greScore", "gmatScore"].includes(f.name)
      ),
      color: "from-cyan-500 to-cyan-600"
    },
    {
      id: "documents",
      title: "Required Documents",
      subtitle: "Upload your supporting documents",
      icon: Upload,
      fields: masterFields.filter(f => 
        f.categoryId === "documents" && 
        ["resume", "transcripts", "recommendationLetters", "portfolio"].includes(f.name)
      ),
      color: "from-teal-500 to-teal-600"
    },
    {
      id: "statement",
      title: "Statement of Purpose",
      subtitle: "Why do you want to study this course",
      icon: Target,
      fields: masterFields.filter(f => 
        f.categoryId === "additional" && 
        ["statementOfPurpose", "whyThisUniversity"].includes(f.name)
      ),
      color: "from-pink-500 to-pink-600"
    },
    {
      id: "additional",
      title: "Additional Information",
      subtitle: "Any other relevant details",
      icon: Info,
      fields: masterFields.filter(f => 
        f.categoryId === "additional" && 
        ["extracurricular", "specialNeeds", "additionalComments"].includes(f.name)
      ),
      color: "from-violet-500 to-violet-600"
    },
    {
      id: "review",
      title: "Review & Submit",
      subtitle: "Check your application before submitting",
      icon: CheckCircle2,
      fields: [],
      color: "from-slate-500 to-slate-600"
    }
  ];

  const currentStepData = wizardSteps[currentStep];
  const progress = ((currentStep + 1) / wizardSteps.length) * 100;

  const validateStep = () => {
    const stepErrors: Record<string, string> = {};
    const currentFields = currentStepData.fields;
    
    currentFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        stepErrors[field.name] = `${field.label} is required`;
      }
    });
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (currentStep === wizardSteps.length - 1) {
      handleSubmit();
      return;
    }
    
    if (validateStep()) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast({
        title: "Please complete required fields",
        description: "Fill in all required fields before proceeding",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (index: number) => {
    // Allow navigation to completed steps or current step
    if (index <= currentStep || completedSteps.includes(index)) {
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveProgress = () => {
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
    const applicationData = {
      formId,
      courseInfo,
      formData,
      submittedAt: new Date().toISOString()
    };
    
    const submissions = JSON.parse(localStorage.getItem("submitted_applications") || "[]");
    submissions.push(applicationData);
    localStorage.setItem("submitted_applications", JSON.stringify(submissions));
    
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
      
      toast({
        title: "Progress Restored",
        description: "Your previous progress has been loaded.",
      });
    }
  }, [formId, toast]);

  const renderField = (field: ApplicationField) => {
    const value = formData[field.name] || "";
    const hasError = errors[field.name];
    
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "url":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              className={cn(
                "transition-all",
                hasError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              rows={4}
              className={cn(
                "transition-all resize-none",
                hasError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "select":
      case "country":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleInputChange(field.name, val)}>
              <SelectTrigger className={cn(
                hasError && "border-destructive focus-visible:ring-destructive"
              )}>
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
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            <Label className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup value={value} onValueChange={(val) => handleInputChange(field.name, val)}>
              {field.options?.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
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
              <Label htmlFor={field.id} className="font-normal cursor-pointer">
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </Label>
            </div>
            {hasError && (
              <p className="text-sm text-destructive ml-6">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground ml-6">{field.description}</p>
            )}
          </div>
        );
        
      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              className={cn(
                hasError && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      case "file":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(hasError && "text-destructive")}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id={field.id}
                type="file"
                onChange={(e) => handleInputChange(field.name, e.target.files?.[0]?.name || "")}
                required={field.required}
                className={cn(
                  "cursor-pointer",
                  hasError && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {value && (
                <span className="text-sm text-muted-foreground">
                  Current: {value}
                </span>
              )}
            </div>
            {hasError && (
              <p className="text-sm text-destructive">{errors[field.name]}</p>
            )}
            {field.description && !hasError && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderReviewStep = () => {
    const filledSections = wizardSteps.slice(0, -1).filter((step, index) => 
      completedSteps.includes(index)
    );
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-3">Application Summary</h3>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Course: {courseInfo.courseName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">University: {courseInfo.universityName}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {filledSections.length} of {wizardSteps.length - 1} sections completed
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid gap-3">
          {wizardSteps.slice(0, -1).map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(index);
            
            return (
              <Card 
                key={index} 
                className={cn(
                  "transition-all hover:shadow-md cursor-pointer",
                  !isCompleted && "opacity-60"
                )}
                onClick={() => setCurrentStep(index)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-r",
                        step.color,
                        !isCompleted && "opacity-50"
                      )}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{step.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {step.fields.length} fields
                        </p>
                      </div>
                    </div>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Button variant="outline" size="sm">
                        Complete
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
        
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <Checkbox id="terms" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                  I confirm that all information provided is accurate and complete
                </Label>
                <p className="text-xs text-muted-foreground">
                  By submitting this application, you agree to the terms and conditions
                  and acknowledge that false information may result in rejection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Application Form</h1>
              <p className="text-sm text-muted-foreground">
                {courseInfo.courseName} • {courseInfo.universityName}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveProgress}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save Progress</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {wizardSteps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2 mb-6" />
            
            {/* Step Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {wizardSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = completedSteps.includes(index);
                const isClickable = index <= currentStep || isCompleted;
                
                return (
                  <button
                    key={index}
                    onClick={() => isClickable && handleStepClick(index)}
                    disabled={!isClickable}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                      isActive && "bg-primary text-primary-foreground shadow-lg scale-105",
                      isCompleted && !isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                      !isActive && !isCompleted && "bg-muted text-muted-foreground",
                      isClickable && !isActive && "hover:bg-muted hover:text-foreground cursor-pointer",
                      !isClickable && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <Icon className="h-3 w-3" />
                    )}
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{index + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Step Navigation */}
            <div className="hidden lg:block">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <nav className="space-y-1">
                    {wizardSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isActive = index === currentStep;
                      const isCompleted = completedSteps.includes(index);
                      const isClickable = index <= currentStep || isCompleted;
                      
                      return (
                        <button
                          key={index}
                          onClick={() => isClickable && handleStepClick(index)}
                          disabled={!isClickable}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left",
                            isActive && "bg-primary text-primary-foreground",
                            isCompleted && !isActive && "text-primary hover:bg-primary/10",
                            !isActive && !isCompleted && "text-muted-foreground",
                            isClickable && !isActive && "hover:bg-muted",
                            !isClickable && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{step.title}</div>
                            <div className="text-xs opacity-80 truncate">
                              {step.subtitle}
                            </div>
                          </div>
                          {isCompleted && (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg">
                    <CardHeader className={cn(
                      "relative overflow-hidden",
                      currentStep !== wizardSteps.length - 1 && "pb-8"
                    )}>
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-r opacity-10",
                        currentStepData.color
                      )} />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn(
                            "p-2 rounded-lg bg-gradient-to-r",
                            currentStepData.color
                          )}>
                            <currentStepData.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                            <CardDescription>{currentStepData.subtitle}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {currentStep === wizardSteps.length - 1 ? (
                        renderReviewStep()
                      ) : (
                        <>
                          {currentStepData.fields.length > 0 ? (
                            currentStepData.fields.map(field => renderField(field))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <Info className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>No fields available for this section</p>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>

                    {/* Navigation Buttons */}
                    <div className="border-t px-6 py-4 bg-muted/5">
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 0}
                          className="gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        {currentStep === wizardSteps.length - 1 ? (
                          <Button 
                            onClick={handleSubmit}
                            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                          >
                            <Send className="h-4 w-4" />
                            Submit Application
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleNext}
                            className="gap-2"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationWizard;