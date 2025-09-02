import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Building2, MapPin, Users, GraduationCap, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UniversityDetails } from '@/types/university';

const Universities = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<UniversityDetails[]>([]);
  const [deleteUniversityId, setDeleteUniversityId] = useState<string | null>(null);

  useEffect(() => {
    const savedUniversities = localStorage.getItem('acado_universities');
    if (savedUniversities) {
      setUniversities(JSON.parse(savedUniversities));
    }
  }, []);

  const handleDelete = () => {
    if (deleteUniversityId) {
      const updatedUniversities = universities.filter(u => u.id !== deleteUniversityId);
      setUniversities(updatedUniversities);
      localStorage.setItem('acado_universities', JSON.stringify(updatedUniversities));
      setDeleteUniversityId(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Universities</h1>
            <p className="text-muted-foreground mt-1">Manage partner universities and their profiles</p>
          </div>
          <Button variant="gradient" className="gap-2" onClick={() => navigate('/universities/add')}>
            <Plus className="w-4 h-4" />
            Add University
          </Button>
        </div>

        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search universities..." className="pl-10" />
          </div>
        </Card>

        {universities.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No universities added yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first partner university</p>
            <Button variant="outline" onClick={() => navigate('/universities/add')}>
              Add Your First University
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <Card key={university.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{university.name}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{university.location.city}, {university.location.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{university.factsAndFigures.totalStudents.toLocaleString()} students</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setDeleteUniversityId(university.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteUniversityId} onOpenChange={() => setDeleteUniversityId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the university.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Universities;