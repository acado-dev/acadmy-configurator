import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/types/application';

const Courses = () => {
  const [courses] = useState<Course[]>([
    {
      id: '1',
      universityId: '1',
      name: 'MSc Computer Science',
      type: 'degree',
      duration: '2 years',
      description: 'Advanced computer science program',
      isActive: true,
    },
    {
      id: '2',
      universityId: '1',
      name: 'Exchange Program',
      type: 'exchange',
      duration: '6 months',
      description: 'International student exchange',
      isActive: true,
    },
  ]);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      degree: 'bg-primary text-primary-foreground',
      exchange: 'bg-secondary text-secondary-foreground',
      pathway: 'bg-success text-primary-foreground',
      diploma: 'bg-warning text-primary-foreground',
      certification: 'bg-accent text-accent-foreground',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage university courses and programs</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-10" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 hover-lift">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <Badge className={getTypeColor(course.type)}>
                  {course.type.toUpperCase()}
                </Badge>
                <Badge variant={course.isActive ? "secondary" : "outline"}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{course.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                <p className="text-xs text-muted-foreground mt-2">Duration: {course.duration}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;