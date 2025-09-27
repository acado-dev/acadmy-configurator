import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, ArrowLeft, Trash2, GripVertical, Users, FileText, Calendar, Mail, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormsData } from '@/hooks/useFormsData';

interface ProcessStep {
  id: string;
  name: string;
  type: 'interview' | 'test' | 'document-review' | 'committee-review' | 'final-decision';
  description: string;
  duration: string;
  responsible: string;
  order: number;
}

export default function ProcessConfiguration() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courses } = useFormsData();
  
  const [selectedCourse, setSelectedCourse] = useState(courseId || '');
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const course = courses.find(c => c.id === selectedCourse);

  useEffect(() => {
    if (courseId && courseId !== 'new') {
      // Load existing process configuration
      loadExistingProcess(courseId);
    }
  }, [courseId]);

  const loadExistingProcess = (id: string) => {
    // Mock loading existing process
    const mockSteps: ProcessStep[] = [
      {
        id: '1',
        name: 'Initial Screening',
        type: 'document-review',
        description: 'Review of application documents',
        duration: '2 days',
        responsible: 'Admissions Team',
        order: 1
      },
      {
        id: '2',
        name: 'Written Test',
        type: 'test',
        description: 'Online aptitude and subject test',
        duration: '1 day',
        responsible: 'Testing Center',
        order: 2
      }
    ];
    setSteps(mockSteps);
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      name: '',
      type: 'document-review',
      description: '',
      duration: '',
      responsible: '',
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (stepId: string, field: keyof ProcessStep, value: any) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, [field]: value } : step
    ));
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
    // Reorder remaining steps
    setSteps(prev => prev.map((step, index) => ({ ...step, order: index + 1 })));
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(s => s.id === stepId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) {
      return;
    }
    
    const newSteps = [...steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    
    // Update order
    newSteps.forEach((step, i) => {
      step.order = i + 1;
    });
    
    setSteps(newSteps);
  };

  const handleSave = async () => {
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Please select a course",
        variant: "destructive"
      });
      return;
    }

    if (steps.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one process step",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Simulate saving
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Selection process configuration saved successfully"
      });
      navigate('/university/process-steps');
    }, 1000);
  };

  const getStepIcon = (type: ProcessStep['type']) => {
    switch (type) {
      case 'interview':
        return <Users className="h-4 w-4" />;
      case 'test':
        return <FileText className="h-4 w-4" />;
      case 'document-review':
        return <FileText className="h-4 w-4" />;
      case 'committee-review':
        return <Users className="h-4 w-4" />;
      case 'final-decision':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/university/process-steps')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {courseId === 'new' ? 'Create Selection Process' : 'Edit Selection Process'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure the multi-step selection workflow for your course
          </p>
        </div>
      </div>

      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Course Selection</CardTitle>
          <CardDescription>
            Select the course for which you want to configure the selection process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="course">Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} - {course.universityId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {course && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">{course.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">University:</span> {course.universityId}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span> {course.duration}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span> {course.type}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Process Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Selection Process Steps</CardTitle>
          <CardDescription>
            Define each step of your selection process in order
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <Card key={step.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveStep(step.id, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveStep(step.id, 'down')}
                      disabled={index === steps.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-mono">
                        Step {step.order}
                      </Badge>
                      <div className="flex-1">
                        <Input
                          placeholder="Step name (e.g., Initial Screening)"
                          value={step.name}
                          onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                        />
                      </div>
                      <Select 
                        value={step.type} 
                        onValueChange={(value) => updateStep(step.id, 'type', value as ProcessStep['type'])}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="document-review">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Document Review
                            </div>
                          </SelectItem>
                          <SelectItem value="test">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Test/Assessment
                            </div>
                          </SelectItem>
                          <SelectItem value="interview">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Interview
                            </div>
                          </SelectItem>
                          <SelectItem value="committee-review">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Committee Review
                            </div>
                          </SelectItem>
                          <SelectItem value="final-decision">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              Final Decision
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Textarea
                      placeholder="Step description"
                      value={step.description}
                      onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                      rows={2}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Duration</Label>
                        <Input
                          placeholder="e.g., 2 days"
                          value={step.duration}
                          onChange={(e) => updateStep(step.id, 'duration', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Responsible Team/Person</Label>
                        <Input
                          placeholder="e.g., Admissions Team"
                          value={step.responsible}
                          onChange={(e) => updateStep(step.id, 'responsible', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(step.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button onClick={addStep} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Process Step
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/university/process-steps')}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </div>
  );
}