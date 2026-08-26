import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, ArrowLeft, Trash2, GripVertical, Users, FileText, Calendar, Mail, GraduationCap, ClipboardList, Video, PenLine, Link2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormsData } from '@/hooks/useFormsData';
import { useSelectionActivities } from '@/hooks/useSelectionActivities';
import { SelectionModule } from '@/types/selection';
import { saveProcess, totalDurationOf } from '@/lib/selectionProcesses';

type StepType =
  | 'application'
  | 'interview'
  | 'test'
  | 'sop'
  | 'assignment'
  | 'document-review'
  | 'committee-review'
  | 'final-decision';

interface ProcessStep {
  id: string;
  name: string;
  type: StepType;
  description: string;
  duration: string;
  responsible: string;
  order: number;
  weight: number; // Percentage weightage for this step
  activityId?: string;
}

// Step types that need a concrete activity (assessment / assignment / interview) attached
const STEP_ACTIVITY: Partial<Record<StepType, { module: SelectionModule; label: string; createPath: string; listPath: string; presetType?: string }>> = {
  test: { module: 'assessment', label: 'Assessment', createPath: '/assessments/new', listPath: '/assessments' },
  assignment: { module: 'assignment', label: 'Assignment', createPath: '/assignments/new', listPath: '/assignments' },
  sop: { module: 'assignment', label: 'SOP submission', createPath: '/assignments/new', listPath: '/assignments', presetType: 'SOP' },
  interview: { module: 'interview', label: 'Interview', createPath: '/interviews/new', listPath: '/interviews' },
};

const DRAFT_KEY = 'selectionProcessDraft';

export default function ProcessConfiguration() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courses } = useFormsData();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const assessments = useSelectionActivities('assessment');
  const assignments = useSelectionActivities('assignment');
  const interviews = useSelectionActivities('interview');
  const selPrefix = location.pathname.startsWith('/university') ? '/university' : '';
  const courseKey = courseId ?? 'new';
  
  const [selectedCourse, setSelectedCourse] = useState(courseId || '');
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const course = courses.find(c => c.id === selectedCourse);

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const draft = JSON.parse(raw);
        if (draft?.courseKey === courseKey) {
          setSteps(draft.steps ?? []);
          if (draft.selectedCourse) setSelectedCourse(draft.selectedCourse);
          return;
        }
      } catch {
        // ignore malformed draft
      }
    }
    if (courseId && courseId !== 'new') {
      loadExistingProcess(courseId);
    }
  }, [courseId]);

  // Attach a newly created activity coming back from the activity form
  useEffect(() => {
    const attachStep = searchParams.get('attachStep');
    const activityId = searchParams.get('activityId');
    if (!attachStep || !activityId) return;
    setSteps((prev) => prev.map((s) => (s.id === attachStep ? { ...s, activityId } : s)));
    setSearchParams({}, { replace: true });
    toast({ title: 'Activity linked', description: 'The new activity is attached to this step.' });
  }, [searchParams]);

  const saveDraft = (nextSteps: ProcessStep[]) => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ courseKey, selectedCourse, steps: nextSteps })
    );
  };

  const activitiesFor = (module: SelectionModule) =>
    (module === 'assessment' ? assessments.activities : module === 'assignment' ? assignments.activities : interviews.activities) as any[];

  const goCreateActivity = (step: ProcessStep) => {
    const cfg = STEP_ACTIVITY[step.type];
    if (!cfg) return;
    saveDraft(steps);
    const params = new URLSearchParams({ returnTo: location.pathname, stepId: step.id });
    if (cfg.presetType) params.set('presetType', cfg.presetType);
    navigate(`${selPrefix}${cfg.createPath}?${params.toString()}`);
  };

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
        order: 1,
        weight: 30
      },
      {
        id: '2',
        name: 'Written Test',
        type: 'test',
        description: 'Online aptitude and subject test',
        duration: '1 day',
        responsible: 'Testing Center',
        order: 2,
        weight: 40
      }
    ];
    setSteps(mockSteps);
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      name: '',
      type: 'application',
      description: '',
      duration: '',
      responsible: '',
      order: steps.length + 1,
      weight: 0
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

    const totalWeight = steps.reduce((sum, step) => sum + (step.weight || 0), 0);
    if (totalWeight !== 100) {
      toast({
        title: "Error",
        description: `Total weightage must equal 100%. Current total: ${totalWeight}%`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const courseLabel =
      courses.find((c: any) => String(c.id) === String(selectedCourse))?.name ?? 'Selected course';
    saveProcess({
      id: `proc-${courseKey}`,
      courseId: String(selectedCourse),
      courseName: courseLabel,
      steps: steps as any,
      totalDuration: totalDurationOf(steps as any),
      status: 'active',
      updatedAt: new Date().toISOString(),
    });
    // Simulate saving
    setTimeout(() => {
      setIsLoading(false);
      localStorage.removeItem(DRAFT_KEY);
      toast({
        title: "Success",
        description: "Selection process configuration saved successfully"
      });
      navigate('/university/process-steps');
    }, 1000);
  };

  const getStepIcon = (type: ProcessStep['type']) => {
    switch (type) {
      case 'application':
        return <FileText className="h-4 w-4" />;
      case 'interview':
        return <Users className="h-4 w-4" />;
      case 'test':
        return <ClipboardList className="h-4 w-4" />;
      case 'sop':
        return <PenLine className="h-4 w-4" />;
      case 'assignment':
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
            {courseKey === 'new' ? 'Create Selection Process' : 'Edit Selection Process'}
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
                          <SelectItem value="application">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Application Collection
                            </div>
                          </SelectItem>
                          <SelectItem value="document-review">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Document Review
                            </div>
                          </SelectItem>
                          <SelectItem value="test">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="h-4 w-4" />
                              Test/Assessment
                            </div>
                          </SelectItem>
                          <SelectItem value="sop">
                            <div className="flex items-center gap-2">
                              <PenLine className="h-4 w-4" />
                              SOP Submission
                            </div>
                          </SelectItem>
                          <SelectItem value="assignment">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Assignment
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
                    
                    <div className="grid grid-cols-3 gap-4">
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
                      <div>
                        <Label>Weightage (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="e.g., 30"
                          value={step.weight || 0}
                          onChange={(e) => updateStep(step.id, 'weight', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    {STEP_ACTIVITY[step.type] && (() => {
                      const cfg = STEP_ACTIVITY[step.type]!;
                      const list = activitiesFor(cfg.module).filter(
                        (a) => !selectedCourse || a.courseId === selectedCourse
                      );
                      const linked = activitiesFor(cfg.module).find((a) => a.id === step.activityId);
                      return (
                        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium">{cfg.label} for this step</p>
                            {linked ? (
                              <Badge variant="secondary">Linked</Badge>
                            ) : (
                              <Badge variant="outline">Not configured</Badge>
                            )}
                          </div>
                          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                            <Select
                              value={step.activityId ?? ''}
                              onValueChange={(v) => updateStep(step.id, 'activityId', v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={`Select an existing ${cfg.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {list.length === 0 ? (
                                  <div className="px-2 py-3 text-sm text-muted-foreground">
                                    No {cfg.label.toLowerCase()} created yet
                                  </div>
                                ) : (
                                  list.map((a) => (
                                    <SelectItem key={a.id} value={a.id}>
                                      {a.title}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={() => goCreateActivity(step)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Create new {cfg.label.toLowerCase()}
                            </Button>
                            {linked && (
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  saveDraft(steps);
                                  navigate(`${selPrefix}${cfg.listPath}/${linked.id}/edit`);
                                }}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open
                              </Button>
                            )}
                          </div>
                          {linked && (
                            <p className="text-xs text-muted-foreground">
                              {linked.title} · {new Date(linked.startAt).toLocaleDateString()} –{' '}
                              {new Date(linked.endAt).toLocaleDateString()} · status {linked.status}
                            </p>
                          )}
                        </div>
                      );
                    })()}

                    {index === steps.length - 1 && steps.length > 1 && (
                      <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">Total Weightage: </span>
                          <span className={`font-bold ${steps.reduce((sum, s) => sum + (s.weight || 0), 0) === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {steps.reduce((sum, s) => sum + (s.weight || 0), 0)}%
                          </span>
                          {steps.reduce((sum, s) => sum + (s.weight || 0), 0) !== 100 && (
                            <span className="text-muted-foreground ml-2">(Should equal 100%)</span>
                          )}
                        </div>
                      </div>
                    )}
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