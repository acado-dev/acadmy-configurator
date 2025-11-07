import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { CourseLevel } from '@/types/courseLevel';
import { AddEditCourseLevelDialog } from '@/components/courseLevels/AddEditCourseLevelDialog';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'courseLevels';

// Sample data
const sampleLevels: CourseLevel[] = [
  {
    id: '1',
    name: 'Undergraduate',
    shortName: 'UG',
    description: 'Bachelor degree programs',
    keywords: 'bachelor, undergraduate, degree',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Postgraduate',
    shortName: 'PG',
    description: 'Master degree programs',
    keywords: 'master, postgraduate, graduate',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Doctoral',
    shortName: 'PhD',
    description: 'Doctorate and PhD programs',
    keywords: 'phd, doctorate, research',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Certificate',
    shortName: 'CERT',
    description: 'Professional certificate programs',
    keywords: 'certificate, professional, short-term',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Diploma',
    shortName: 'DIP',
    description: 'Diploma programs',
    keywords: 'diploma, vocational',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function CourseLevels() {
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<CourseLevel | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<CourseLevel | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLevels(JSON.parse(stored));
    } else {
      setLevels(sampleLevels);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleLevels));
    }
  }, []);

  const saveLevels = (updatedLevels: CourseLevel[]) => {
    setLevels(updatedLevels);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLevels));
  };

  const handleAdd = (level: Omit<CourseLevel, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLevel: CourseLevel = {
      ...level,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveLevels([...levels, newLevel]);
    toast({
      title: 'Success',
      description: 'Course level added successfully',
    });
  };

  const handleEdit = (level: Omit<CourseLevel, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingLevel) return;
    
    const updated = levels.map((l) =>
      l.id === editingLevel.id
        ? { ...level, id: l.id, createdAt: l.createdAt, updatedAt: new Date().toISOString() }
        : l
    );
    saveLevels(updated);
    setEditingLevel(null);
    toast({
      title: 'Success',
      description: 'Course level updated successfully',
    });
  };

  const handleDelete = () => {
    if (!levelToDelete) return;

    const updated = levels.filter((l) => l.id !== levelToDelete.id);
    saveLevels(updated);
    setDeleteDialogOpen(false);
    setLevelToDelete(null);
    toast({
      title: 'Success',
      description: 'Course level deleted successfully',
    });
  };

  const toggleActive = (id: string) => {
    const updated = levels.map((l) =>
      l.id === id ? { ...l, isActive: !l.isActive, updatedAt: new Date().toISOString() } : l
    );
    saveLevels(updated);
    toast({
      title: 'Success',
      description: 'Course level status updated',
    });
  };

  const openEditDialog = (level: CourseLevel) => {
    setEditingLevel(level);
    setIsAddEditDialogOpen(true);
  };

  const openDeleteDialog = (level: CourseLevel) => {
    setLevelToDelete(level);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Course Levels</h1>
          <p className="text-muted-foreground mt-1">
            Manage course levels and degree types
          </p>
        </div>
        <Button onClick={() => setIsAddEditDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Level
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {levels.map((level) => (
              <TableRow key={level.id}>
                <TableCell className="font-medium">{level.name}</TableCell>
                <TableCell>{level.shortName}</TableCell>
                <TableCell>{level.description || '-'}</TableCell>
                <TableCell>
                  <Badge variant={level.isActive ? 'default' : 'secondary'}>
                    {level.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={level.isActive}
                      onCheckedChange={() => toggleActive(level.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(level)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(level)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddEditCourseLevelDialog
        isOpen={isAddEditDialogOpen}
        onClose={() => {
          setIsAddEditDialogOpen(false);
          setEditingLevel(null);
        }}
        onSave={editingLevel ? handleEdit : handleAdd}
        level={editingLevel}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course Level</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{levelToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
