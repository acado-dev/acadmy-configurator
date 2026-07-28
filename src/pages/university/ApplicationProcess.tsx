import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
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
import { masterCategories, masterFields } from '@/data/masterFields';
import { ApplicationField, FieldCategory } from '@/types/application';
import { CriteriaAgent } from '@/components/criteria/CriteriaAgent';

function ApplicationProcess() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveCriteriaConfig, getCriteriaByCoursId } = useApplicationProcess();
  const { courses, forms } = useFormsData();
  const [minimumScore, setMinimumScore] = useState(70);
  const [criteria, setCriteria] = useState<MatchingCriterion[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});

  const course = courses.find(c => c.id === courseId);
  const courseForm = forms.find(f => course?.applicationFormId === f.id);

  // Get available fields from the form
  const availableFields = useMemo(() => {
    if (!courseForm) return [];
    
    // Get fields from the configured form or use master fields
    const formFields = courseForm.fields.length > 0 ? courseForm.fields : masterFields;
    
    // Group fields by category
    const fieldsByCategory: Record<string, ApplicationField[]> = {};
    formFields.forEach(field => {
      if (!fieldsByCategory[field.categoryId]) {
        fieldsByCategory[field.categoryId] = [];
      }
      fieldsByCategory[field.categoryId].push(field);
    });
    
    return fieldsByCategory;
  }, [courseForm]);

  useEffect(() => {
    // Guard: if no courseId or invalid course, go back to Application Process list
    if (!courseId || !course) {
      navigate('/university/application-process-list');
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
          id: '1',
          fieldName: 'GPA',
          type: 'weighted',
          weight: 30,
          conditions: []
        },
        {
          id: '2',
          fieldName: 'Test Score',
          type: 'weighted',
          weight: 25,
          conditions: []
        },
        {
          id: '3',
          fieldName: 'Work Experience',
          type: 'weighted',
          weight: 20,
          conditions: []
        },
        {
          id: '4',
          fieldName: 'Statement of Purpose',
          type: 'weighted',
          weight: 15,
          conditions: []
        },
        {
          id: '5',
          fieldName: 'Letters of Recommendation',
          type: 'weighted',
          weight: 10,
          conditions: []
        }
      ]);
    }
  }, [courseId, course, getCriteriaByCoursId, navigate]);

  const handleAddCriteria = () => {
    const newCriterion = {
      id: Date.now().toString(),
      fieldName: '',
      type: 'weighted' as const,
      weight: 0,
      conditions: []
    };
    setCriteria(prev => [...prev, newCriterion]);
  };

  const handleCategoryChange = (criterionId: string, categoryId: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [criterionId]: categoryId
    }));
  };

  const handleUpdateCriteria = (index: number, updated: MatchingCriterion) => {
    const newCriteria = [...criteria];
    newCriteria[index] = updated;
    setCriteria(newCriteria);
  };

  const handleRemoveCriteria = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const getCriteriaTypeColor = (type: string) => {
    switch(type) {
      case 'required': return 'destructive';
      case 'weighted': return 'default';
      case 'preferred': return 'secondary';
      default: return 'outline';
    }
  };

  const handleSave = () => {
    if (!courseId) return;

    // Validate that weights sum to 100%
    const totalWeight = criteria.reduce((sum, c) => sum + (c.type === 'weighted' ? c.weight : 0), 0);
    if (totalWeight !== 100) {
      toast({
        title: 'Invalid Configuration',
        description: 'The total weight of weighted criteria must equal 100%',
        variant: 'destructive'
      });
      return;
    }

    const success = saveCriteriaConfig(courseId, minimumScore, criteria);
    if (success) {
      toast({
        title: 'Success',
        description: 'Evaluation criteria saved successfully'
      });
      navigate('/university/application-process-list');
    }
  };

  if (!course) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configure Evaluation Criteria</h1>
          <p className="text-muted-foreground mt-2">
            Set up matching criteria for {course.name}
          </p>
        </div>
      </div>

      {/* Course Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Course:</span>
            <span className="font-medium">{course.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Application Form:</span>
            <span className="font-medium">{courseForm?.name || 'No form assigned'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Minimum Score Setting */}
      <Card>
        <CardHeader>
          <CardTitle>Minimum Evaluation Score</CardTitle>
          <CardDescription>
            Set the minimum score required for applications to be considered
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Minimum Score</Label>
              <span className="font-bold text-primary">{minimumScore}%</span>
            </div>
            <Slider
              value={[minimumScore]}
              onValueChange={(value) => setMinimumScore(value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Applications scoring below {minimumScore}% will be automatically filtered out
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plain-English Criteria Agent */}
      <CriteriaAgent
        context={`Course: ${course.name}${courseForm ? `, application form: ${courseForm.name}` : ''}`}
        availableFields={fieldNameOptions}
        existingCriteria={criteria}
        existingMinimumScore={minimumScore}
        onApply={(agentCriteria, score) => {
          setCriteria(agentCriteria.map(c => ({
            id: c.id,
            fieldName: c.fieldName,
            type: c.type,
            weight: c.weight,
            conditions: c.conditions,
          })));
          setMinimumScore(score);
        }}
      />


      {/* Evaluation Criteria */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>
                Define the criteria and their weights for evaluating applications
              </CardDescription>
            </div>
            <Button 
              onClick={handleAddCriteria} 
              size="sm"
              variant="default"
              type="button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Criterion
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {criteria.map((criterion, index) => (
                <Card key={criterion.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-12 gap-4">
                      {/* Category Selection */}
                      <div className="col-span-3">
                        <Label>Category</Label>
                        <Select
                          value={selectedCategories[criterion.id] || ''}
                          onValueChange={(value) => handleCategoryChange(criterion.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="z-50 bg-background">
                            {masterCategories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Field Name */}
                      <div className="col-span-3">
                        <Label>Field Name</Label>
                        <Select
                          value={criterion.fieldName}
                          onValueChange={(value) => handleUpdateCriteria(index, {
                            ...criterion,
                            fieldName: value
                          })}
                          disabled={!selectedCategories[criterion.id]}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={selectedCategories[criterion.id] ? "Select field" : "Select category first"} />
                          </SelectTrigger>
                          <SelectContent className="z-50 bg-background">
                            {selectedCategories[criterion.id] && availableFields[selectedCategories[criterion.id]]?.map(field => (
                              <SelectItem key={field.id} value={field.label}>
                                {field.label}
                              </SelectItem>
                            ))}
                            {/* Common fields as fallback */}
                            <SelectGroup>
                              <SelectLabel>Common Fields</SelectLabel>
                              <SelectItem value="GPA">GPA</SelectItem>
                              <SelectItem value="Test Score">Test Score</SelectItem>
                              <SelectItem value="Work Experience">Work Experience</SelectItem>
                              <SelectItem value="Statement of Purpose">Statement of Purpose</SelectItem>
                              <SelectItem value="Letters of Recommendation">Letters of Recommendation</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Type */}
                      <div className="col-span-2">
                        <Label>Type</Label>
                        <Select
                          value={criterion.type}
                          onValueChange={(value: 'required' | 'weighted' | 'preferred') => 
                            handleUpdateCriteria(index, {
                              ...criterion,
                              type: value
                            })
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

                      {/* Weight */}
                      <div className="col-span-2">
                        <Label>Weight (%)</Label>
                        <Input
                          type="number"
                          value={criterion.weight}
                          onChange={(e) => handleUpdateCriteria(index, {
                            ...criterion,
                            weight: parseInt(e.target.value) || 0
                          })}
                          disabled={criterion.type !== 'weighted'}
                          min="0"
                          max="100"
                        />
                      </div>

                      {/* Conditions */}
                      <div className="col-span-3">
                        <Label>Conditions</Label>
                        <Input
                          value={criterion.conditions.join(', ')}
                          onChange={(e) => handleUpdateCriteria(index, {
                            ...criterion,
                            conditions: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                          })}
                          placeholder="e.g., ≥3.5"
                        />
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex items-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCriteria(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="mt-2">
                      <Badge variant={getCriteriaTypeColor(criterion.type)}>
                        {criterion.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {criteria.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No criteria defined yet. Click "Add Criterion" to start.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Required Criteria:</span>
              <span className="font-medium">
                {criteria.filter(c => c.type === 'required').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weighted Criteria:</span>
              <span className="font-medium">
                {criteria.filter(c => c.type === 'weighted').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Weight:</span>
              <span className={`font-medium ${
                criteria.reduce((sum, c) => sum + (c.type === 'weighted' ? c.weight : 0), 0) === 100
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}>
                {criteria.reduce((sum, c) => sum + (c.type === 'weighted' ? c.weight : 0), 0)}%
              </span>
            </div>
          </div>

          {criteria.reduce((sum, c) => sum + (c.type === 'weighted' ? c.weight : 0), 0) !== 100 && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The total weight of weighted criteria must equal 100%
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/university/application-process-list')}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Criteria
        </Button>
      </div>
    </div>
  );
}

export default ApplicationProcess;