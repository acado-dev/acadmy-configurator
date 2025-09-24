import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Target,
  Plus,
  Save,
  Trash2,
  AlertCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApplicationProcess, MatchingCriterion } from '@/hooks/useApplicationProcess';
import { useFormsData } from '@/hooks/useFormsData';

const ApplicationProcess = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveCriteriaConfig, getCriteriaByCoursId } = useApplicationProcess();
  const { courses, forms } = useFormsData();
  const [minimumScore, setMinimumScore] = useState(70);
  const [criteria, setCriteria] = useState<MatchingCriterion[]>([]);

  const course = courses.find(c => c.id === courseId);
  const courseForm = forms.find(f => course?.applicationFormId === f.id);

  useEffect(() => {
    // Guard: if no courseId or invalid course, go back to Application Process list
    if (!courseId || !course) {
      navigate('/university/application-process');
      return;
    }

    const existingConfig = getCriteriaByCoursId(courseId);
    if (existingConfig) {
      setMinimumScore(existingConfig.minimumScore);
      setCriteria(existingConfig.criteria);
    } else {
      // Initialize with default criteria
      setCriteria([
        {
          id: Date.now().toString(),
          fieldName: 'gpa',
          type: 'weighted',
          weight: 30,
          conditions: []
        },
        {
          id: (Date.now() + 1).toString(),
          fieldName: 'test_score',
          type: 'weighted',
          weight: 25,
          conditions: []
        },
        {
          id: (Date.now() + 2).toString(),
          fieldName: 'experience',
          type: 'weighted',
          weight: 20,
          conditions: []
        },
        {
          id: (Date.now() + 3).toString(),
          fieldName: 'essay',
          type: 'weighted',
          weight: 15,
          conditions: []
        },
        {
          id: (Date.now() + 4).toString(),
          fieldName: 'interview',
          type: 'weighted',
          weight: 10,
          conditions: []
        }
      ]);
    }
  }, [courseId, course, getCriteriaByCoursId, navigate]);

  const handleAddCriteria = () => {
    const newCriteria: MatchingCriterion = {
      id: Date.now().toString(),
      fieldName: '',
      type: 'weighted',
      weight: 0,
      conditions: []
    };
    setCriteria([...criteria, newCriteria]);
  };

  const handleUpdateCriteria = (index: number, updates: Partial<MatchingCriterion>) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[index] = { ...updatedCriteria[index], ...updates };
    setCriteria(updatedCriteria);
  };

  const handleRemoveCriteria = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const getCriteriaTypeColor = (type: string) => {
    switch (type) {
      case 'required':
        return 'destructive';
      case 'weighted':
        return 'default';
      case 'preferred':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleSave = () => {
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    if (totalWeight !== 100) {
      toast({
        title: "Invalid Configuration",
        description: "Total weight must equal 100%",
        variant: "destructive"
      });
      return;
    }

    if (courseId && saveCriteriaConfig(courseId, minimumScore, criteria)) {
      toast({
        title: "Criteria Saved",
        description: "Matching criteria has been configured successfully"
      });
      navigate('/university/application-process');
    }
  };

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Application Process Configuration</h1>
        <p className="text-muted-foreground mt-2">
          Configure the complete application workflow for {course?.name || 'Course'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Step 1: Application Collection */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <CardTitle>Application Collection</CardTitle>
                  <CardDescription>
                    Application form configured for this course
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {courseForm ? (
                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                  <div>
                    <p className="font-medium">{courseForm.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {courseForm.fields?.length || 0} fields configured
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/university/forms/${courseForm.id}`)}>
                    Edit Form
                  </Button>
                </div>
              ) : (
                <div className="text-center p-6 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">No application form mapped to this course</p>
                  <Button onClick={() => navigate('/university/forms')}>
                    Configure Form
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Evaluation & Shortlisting */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <CardTitle>Evaluation & Shortlisting</CardTitle>
                  <CardDescription>
                    Configure criteria for automated application evaluation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Minimum Score</Label>
                  <span className="text-2xl font-bold">{minimumScore}%</span>
                </div>
                <Slider
                  value={[minimumScore]}
                  onValueChange={([value]) => setMinimumScore(value)}
                  max={100}
                  step={5}
                />
                <p className="text-sm text-muted-foreground">
                  Applications scoring below {minimumScore}% will be automatically filtered out
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>
                Define the criteria and weights for application evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {criteria.map((criterion, index) => (
                    <Card key={criterion.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label>Field</Label>
                            <Select
                              value={criterion.fieldName}
                              onValueChange={(value) => handleUpdateCriteria(index, { fieldName: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gpa">GPA</SelectItem>
                                <SelectItem value="test_score">Test Score (GRE/GMAT/TOEFL)</SelectItem>
                                <SelectItem value="experience">Work Experience</SelectItem>
                                <SelectItem value="essay">Essay Quality</SelectItem>
                                <SelectItem value="interview">Interview Performance</SelectItem>
                                <SelectItem value="portfolio">Portfolio Review</SelectItem>
                                <SelectItem value="recommendations">Letters of Recommendation</SelectItem>
                                <SelectItem value="extracurricular">Extracurricular Activities</SelectItem>
                                {courseForm?.fields.map(field => (
                                  <SelectItem key={field.id} value={field.name}>
                                    {field.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveCriteria(index)}
                            className="ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={criterion.type}
                              onValueChange={(value: 'required' | 'weighted' | 'preferred') => 
                                handleUpdateCriteria(index, { type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="required">Required</SelectItem>
                                <SelectItem value="weighted">Weighted</SelectItem>
                                <SelectItem value="preferred">Preferred</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Weight (%)</Label>
                            <Input
                              type="number"
                              value={criterion.weight}
                              onChange={(e) => handleUpdateCriteria(index, { 
                                weight: parseInt(e.target.value) || 0 
                              })}
                              min={0}
                              max={100}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label>Conditions</Label>
                          <div className="space-y-2 mt-2">
                            {criterion.conditions.map((condition, condIndex) => (
                              <div key={condIndex} className="flex items-center gap-2">
                                <Input
                                  value={condition}
                                  onChange={(e) => {
                                    const newConditions = [...criterion.conditions];
                                    newConditions[condIndex] = e.target.value;
                                    handleUpdateCriteria(index, { conditions: newConditions });
                                  }}
                                  placeholder="Enter condition"
                                />
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    const newConditions = criterion.conditions.filter((_, i) => i !== condIndex);
                                    handleUpdateCriteria(index, { conditions: newConditions });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateCriteria(index, { 
                                conditions: [...criterion.conditions, ''] 
                              })}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Condition
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button onClick={handleAddCriteria} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Criterion
                  </Button>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Weight Summary</CardTitle>
              <CardDescription>
                Overview of criteria weights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="flex items-center justify-between">
                    <span className="text-sm">
                      {criterion.fieldName ? 
                        criterion.fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                        'Unnamed'}
                    </span>
                    <Badge variant={getCriteriaTypeColor(criterion.type) as any}>
                      {criterion.weight}%
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Weight</span>
                  <Badge variant={totalWeight === 100 ? 'default' : 'destructive'}>
                    {totalWeight}%
                  </Badge>
                </div>
              </div>
              {totalWeight !== 100 && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Total weight must equal 100%
                  </AlertDescription>
                </Alert>
              )}
              {totalWeight === 100 && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Weights are properly configured
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={handleSave} className="w-full mt-4">
                <Save className="h-4 w-4 mr-2" />
                Save Criteria
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationProcess;