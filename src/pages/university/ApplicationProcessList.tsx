import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Target, CheckCircle, AlertCircle, MoreVertical, Trash2 } from 'lucide-react';
import { useApplicationProcess } from '@/hooks/useApplicationProcess';
import { useFormsData } from '@/hooks/useFormsData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

function ApplicationProcessList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { criteriaConfigs, deleteCriteriaConfig } = useApplicationProcess();
  const { courses, forms } = useFormsData();
  
  // Filter for current university (mock data)
  const universityId = 'harvard';
  const universityCourses = courses.filter(course => course.universityId === universityId);
  const universityForms = forms.filter(form => form.universityId === universityId);

  const handleCreateNew = (courseId: string) => {
    navigate(`/university/application-process/${courseId}`);
  };

  const handleEdit = (courseId: string) => {
    navigate(`/university/application-process/${courseId}`);
  };

  const handleDelete = (courseId: string) => {
    deleteCriteriaConfig(courseId);
    toast({
      title: "Criteria Deleted",
      description: "Matching criteria has been removed successfully.",
    });
  };

  const getCourseDetails = (courseId: string) => {
    return universityCourses.find(c => c.id === courseId);
  };

  const getFormDetails = (courseId: string) => {
    const course = getCourseDetails(courseId);
    if (course?.applicationFormId) {
      return universityForms.find(f => f.id === course.applicationFormId);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
      <h1 className="text-3xl font-bold">Application Process Configuration</h1>
      <p className="text-muted-foreground mt-2">
        Configure the complete application process: collection forms, evaluation criteria, and selection steps
      </p>
          <p className="text-muted-foreground mt-2">
            Configure evaluation rules for applicant assessment based on form fields and criteria
          </p>
        </div>
      </div>

      {/* Courses without criteria */}
      {universityCourses.filter(course => !criteriaConfigs.find(c => c.courseId === course.id)).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Courses Without Application Process</CardTitle>
            <CardDescription>
              These courses need evaluation criteria and process steps configured for applicant assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {universityCourses
                .filter(course => !criteriaConfigs.find(c => c.courseId === course.id))
                .map(course => (
                  <Card key={course.id} className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">{course.name}</h4>
                          <p className="text-sm text-muted-foreground">{course.type}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <AlertCircle className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-orange-500">No process configured</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => handleCreateNew(course.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Configure Process
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configured Criteria */}
      {criteriaConfigs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configured Application Processes</CardTitle>
            <CardDescription>
              Manage evaluation criteria and process steps for your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Application Form</TableHead>
                  <TableHead>Min. Score</TableHead>
                  <TableHead>Criteria Count</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteriaConfigs.map((config) => {
                  const course = getCourseDetails(config.courseId);
                  const form = getFormDetails(config.courseId);
                  const totalWeight = config.criteria.reduce((sum, c) => sum + c.weight, 0);
                  const isValid = totalWeight === 100;

                  return (
                    <TableRow key={config.courseId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course?.name || 'Unknown Course'}</p>
                          <p className="text-sm text-muted-foreground">{course?.type}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {form ? (
                          <div>
                            <p className="text-sm">{form.name}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {form.fields.length} fields
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No form linked</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{config.minimumScore}%</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span>{config.criteria.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(config.updatedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {isValid ? (
                          <Badge className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Invalid
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(config.courseId)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Criteria
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(config.courseId)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {criteriaConfigs.length === 0 && universityCourses.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Courses Available</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Create courses first before setting up matching criteria for applicant evaluation.
            </p>
            <Button onClick={() => navigate('/university/courses')}>
              Go to Courses
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationProcessList;