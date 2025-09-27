import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Settings, ChevronRight, Calendar, Users, FileText, Mail, GraduationCap, Trash2, MoreVertical } from 'lucide-react';
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

interface ProcessStep {
  id: string;
  name: string;
  type: 'interview' | 'test' | 'document-review' | 'committee-review' | 'final-decision';
  description: string;
  duration: string;
  responsible: string;
  order: number;
}

interface SelectionProcess {
  id: string;
  courseId: string;
  courseName: string;
  steps: ProcessStep[];
  totalDuration: string;
  status: 'active' | 'draft';
  updatedAt: Date;
}

export default function ProcessSteps() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data for selection processes
  const [processes] = useState<SelectionProcess[]>([
    {
      id: '1',
      courseId: 'business-mgmt',
      courseName: 'Business Management',
      steps: [
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
        },
        {
          id: '3',
          name: 'Panel Interview',
          type: 'interview',
          description: 'Video interview with faculty panel',
          duration: '3 days',
          responsible: 'Faculty Panel',
          order: 3
        },
        {
          id: '4',
          name: 'Final Review',
          type: 'committee-review',
          description: 'Committee decision on admission',
          duration: '2 days',
          responsible: 'Admission Committee',
          order: 4
        }
      ],
      totalDuration: '8 days',
      status: 'active',
      updatedAt: new Date()
    },
    {
      id: '2',
      courseId: 'comp-sci',
      courseName: 'Computer Science',
      steps: [
        {
          id: '1',
          name: 'Technical Assessment',
          type: 'test',
          description: 'Coding test and problem solving',
          duration: '1 day',
          responsible: 'Tech Team',
          order: 1
        },
        {
          id: '2',
          name: 'Technical Interview',
          type: 'interview',
          description: 'Technical discussion with faculty',
          duration: '2 days',
          responsible: 'CS Faculty',
          order: 2
        }
      ],
      totalDuration: '3 days',
      status: 'active',
      updatedAt: new Date()
    }
  ]);

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
        return <Settings className="h-4 w-4" />;
    }
  };

  const getStepTypeColor = (type: ProcessStep['type']) => {
    switch (type) {
      case 'interview':
        return 'bg-blue-500/10 text-blue-600';
      case 'test':
        return 'bg-purple-500/10 text-purple-600';
      case 'document-review':
        return 'bg-amber-500/10 text-amber-600';
      case 'committee-review':
        return 'bg-green-500/10 text-green-600';
      case 'final-decision':
        return 'bg-indigo-500/10 text-indigo-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  const handleConfigureProcess = (courseId: string) => {
    // Navigate to process configuration page
    navigate(`/university/process-configuration/${courseId}`);
  };

  const handleDeleteProcess = (processId: string) => {
    toast({
      title: "Process Deleted",
      description: "Selection process has been removed successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Selection Process Steps</h1>
          <p className="text-muted-foreground mt-2">
            Configure the selection process workflow for each course
          </p>
        </div>
        <Button onClick={() => navigate('/university/process-configuration/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Process
        </Button>
      </div>

      {/* Configured Processes */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Selection Processes</CardTitle>
          <CardDescription>
            Manage the multi-step selection workflow for your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Process Steps</TableHead>
                <TableHead>Total Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>
                    <div className="font-medium">{process.courseName}</div>
                    <div className="text-sm text-muted-foreground">
                      {process.steps.length} steps configured
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {process.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-1">
                          <Badge variant="outline" className={cn("text-xs", getStepTypeColor(step.type))}>
                            {getStepIcon(step.type)}
                            <span className="ml-1">{step.name}</span>
                          </Badge>
                          {index < process.steps.length - 1 && (
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{process.totalDuration}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={process.status === 'active' ? 'default' : 'secondary'}>
                      {process.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {process.updatedAt.toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleConfigureProcess(process.courseId)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Process
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProcess(process.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Courses without process */}
      <Card>
        <CardHeader>
          <CardTitle>Courses Without Selection Process</CardTitle>
          <CardDescription>
            Set up the selection workflow for these courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors" 
                  onClick={() => handleConfigureProcess('data-science')}>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1">Data Science</h4>
                <p className="text-sm text-muted-foreground mb-3">No process configured</p>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Process
                </Button>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleConfigureProcess('economics')}>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1">Economics</h4>
                <p className="text-sm text-muted-foreground mb-3">No process configured</p>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Process
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add cn utility import
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}