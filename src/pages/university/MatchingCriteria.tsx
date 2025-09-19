import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  Target,
  Plus,
  Save,
  Trash2,
  Settings,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MatchingCriteria = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [minimumScore, setMinimumScore] = useState(70);
  const [criteria, setCriteria] = useState([
    {
      id: '1',
      fieldName: 'GPA',
      fieldId: 'gpa',
      type: 'weighted',
      weight: 30,
      conditions: [
        { operator: 'greaterThan', value: 3.5, score: 100 },
        { operator: 'between', value: [3.0, 3.5], score: 75 },
        { operator: 'between', value: [2.5, 3.0], score: 50 }
      ]
    },
    {
      id: '2',
      fieldName: 'Test Scores (GRE/GMAT)',
      fieldId: 'test_scores',
      type: 'weighted',
      weight: 25,
      conditions: [
        { operator: 'greaterThan', value: 320, score: 100 },
        { operator: 'between', value: [300, 320], score: 75 }
      ]
    },
    {
      id: '3',
      fieldName: 'Work Experience',
      fieldId: 'work_experience',
      type: 'weighted',
      weight: 20,
      conditions: [
        { operator: 'greaterThan', value: 5, score: 100 },
        { operator: 'between', value: [3, 5], score: 75 },
        { operator: 'between', value: [1, 3], score: 50 }
      ]
    },
    {
      id: '4',
      fieldName: 'English Proficiency',
      fieldId: 'english_proficiency',
      type: 'required',
      weight: 15,
      conditions: [
        { operator: 'in', value: ['TOEFL', 'IELTS'], score: 100 }
      ]
    },
    {
      id: '5',
      fieldName: 'Letters of Recommendation',
      fieldId: 'recommendations',
      type: 'preferred',
      weight: 10,
      conditions: [
        { operator: 'greaterThan', value: 2, score: 100 }
      ]
    }
  ]);

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  const handleAddCriteria = () => {
    const newCriteria = {
      id: Date.now().toString(),
      fieldName: '',
      fieldId: '',
      type: 'weighted',
      weight: 0,
      conditions: []
    };
    setCriteria([...criteria, newCriteria]);
  };

  const handleUpdateCriteria = (id: string, updates: any) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleRemoveCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleSave = () => {
    if (totalWeight !== 100) {
      toast({
        title: "Error",
        description: "Total weight must equal 100%",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Criteria saved",
      description: "Matching criteria has been configured successfully",
    });
    navigate('/university/courses');
  };

  const getCriteriaTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      required: 'destructive',
      weighted: 'default',
      preferred: 'secondary'
    };
    return colors[type] || 'default';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configure Matching Criteria</h1>
            <p className="text-muted-foreground">Set up evaluation rules for MBA program applications</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Criteria
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Minimum Acceptance Score</CardTitle>
                <CardDescription>Set the minimum score required for application consideration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Minimum Score</Label>
                    <span className="text-2xl font-bold text-primary">{minimumScore}%</span>
                  </div>
                  <Slider
                    value={[minimumScore]}
                    onValueChange={(value) => setMinimumScore(value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Applications scoring below {minimumScore}% will be automatically marked for review
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evaluation Criteria</CardTitle>
                <CardDescription>Define the criteria and weights for application evaluation</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {criteria.map((criterion) => (
                      <Card key={criterion.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Input
                                value={criterion.fieldName}
                                onChange={(e) => handleUpdateCriteria(criterion.id, { fieldName: e.target.value })}
                                placeholder="Field name"
                                className="font-medium"
                              />
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge variant={getCriteriaTypeColor(criterion.type) as any}>
                                {criterion.type}
                              </Badge>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveCriteria(criterion.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Type</Label>
                              <Select
                                value={criterion.type}
                                onValueChange={(value) => handleUpdateCriteria(criterion.id, { type: value })}
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
                            <div className="space-y-2">
                              <Label>Weight (%)</Label>
                              <Input
                                type="number"
                                value={criterion.weight}
                                onChange={(e) => handleUpdateCriteria(criterion.id, { weight: parseInt(e.target.value) })}
                                min={0}
                                max={100}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Conditions</Label>
                            <div className="space-y-2">
                              {criterion.conditions.map((condition, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                                  <Select value={condition.operator}>
                                    <SelectTrigger className="w-[150px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="equals">Equals</SelectItem>
                                      <SelectItem value="greaterThan">Greater Than</SelectItem>
                                      <SelectItem value="lessThan">Less Than</SelectItem>
                                      <SelectItem value="between">Between</SelectItem>
                                      <SelectItem value="in">In List</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input 
                                    placeholder="Value" 
                                    value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                                    className="flex-1"
                                  />
                                  <Input 
                                    type="number" 
                                    placeholder="Score" 
                                    value={condition.score}
                                    className="w-[100px]"
                                  />
                                  <Button size="icon" variant="ghost">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => {
                                  const newCondition = { operator: 'equals', value: '', score: 0 };
                                  handleUpdateCriteria(criterion.id, {
                                    conditions: [...criterion.conditions, newCondition]
                                  });
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Condition
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Button 
                      onClick={handleAddCriteria}
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Criteria
                    </Button>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Weight Distribution</CardTitle>
                <CardDescription>Overview of criteria weights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {criteria.map((criterion) => (
                    <div key={criterion.id} className="flex justify-between items-center">
                      <span className="text-sm">{criterion.fieldName || 'Unnamed'}</span>
                      <Badge variant={totalWeight === 100 ? 'secondary' : 'outline'}>
                        {criterion.weight}%
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Weight</span>
                    <Badge 
                      variant={totalWeight === 100 ? 'secondary' : 'destructive'}
                      className="text-lg"
                    >
                      {totalWeight}%
                    </Badge>
                  </div>
                </div>

                {totalWeight !== 100 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Total weight must equal 100%. Currently at {totalWeight}%.
                    </AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Applications will be automatically scored based on these criteria. 
                    The final score determines the application's ranking.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingCriteria;