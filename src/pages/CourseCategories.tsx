import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
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
import { CourseCategory } from '@/types/courseCategory';
import { AddEditCourseCategoryDialog } from '@/components/courseCategories/AddEditCourseCategoryDialog';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'courseCategories';

// Sample data
const sampleCategories: CourseCategory[] = [
  {
    id: '1',
    name: 'Science & Technology',
    shortName: 'SCI-TECH',
    code: 'ST',
    parentId: null,
    description: 'Science and Technology related courses',
    keywords: 'science, technology, engineering',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Computer Science',
    shortName: 'CS',
    code: 'CS',
    parentId: '1',
    description: 'Computer Science and Programming courses',
    keywords: 'programming, software, algorithms',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Artificial Intelligence',
    shortName: 'AI',
    code: 'AI',
    parentId: '2',
    description: 'AI and Machine Learning courses',
    keywords: 'ai, machine learning, deep learning',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Business & Management',
    shortName: 'BUS-MGT',
    code: 'BM',
    parentId: null,
    description: 'Business and Management courses',
    keywords: 'business, management, leadership',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Marketing',
    shortName: 'MKT',
    code: 'MKT',
    parentId: '4',
    description: 'Marketing and Sales courses',
    keywords: 'marketing, sales, advertising',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function CourseCategories() {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CourseCategory | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCategories(JSON.parse(stored));
    } else {
      setCategories(sampleCategories);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCategories));
    }
  }, []);

  const saveCategories = (updatedCategories: CourseCategory[]) => {
    setCategories(updatedCategories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCategories));
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleAdd = (category: Omit<CourseCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: CourseCategory = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveCategories([...categories, newCategory]);
    toast({
      title: 'Success',
      description: 'Category added successfully',
    });
  };

  const handleEdit = (category: Omit<CourseCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingCategory) return;
    
    const updated = categories.map((c) =>
      c.id === editingCategory.id
        ? { ...category, id: c.id, createdAt: c.createdAt, updatedAt: new Date().toISOString() }
        : c
    );
    saveCategories(updated);
    setEditingCategory(null);
    toast({
      title: 'Success',
      description: 'Category updated successfully',
    });
  };

  const handleDelete = () => {
    if (!categoryToDelete) return;

    // Check if category has children
    const hasChildren = categories.some((c) => c.parentId === categoryToDelete.id);
    if (hasChildren) {
      toast({
        title: 'Error',
        description: 'Cannot delete category with subcategories',
        variant: 'destructive',
      });
      setDeleteDialogOpen(false);
      return;
    }

    const updated = categories.filter((c) => c.id !== categoryToDelete.id);
    saveCategories(updated);
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
    toast({
      title: 'Success',
      description: 'Category deleted successfully',
    });
  };

  const toggleActive = (id: string) => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, isActive: !c.isActive, updatedAt: new Date().toISOString() } : c
    );
    saveCategories(updated);
    toast({
      title: 'Success',
      description: 'Category status updated',
    });
  };

  const openEditDialog = (category: CourseCategory) => {
    setEditingCategory(category);
    setIsAddEditDialogOpen(true);
  };

  const openDeleteDialog = (category: CourseCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // Build hierarchical structure
  const buildTree = (parentId: string | null = null, level: number = 0): JSX.Element[] => {
    return categories
      .filter((c) => c.parentId === parentId)
      .map((category) => {
        const hasChildren = categories.some((c) => c.parentId === category.id);
        const isExpanded = expandedIds.has(category.id);

        return (
          <React.Fragment key={category.id}>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
                  {hasChildren ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleExpand(category.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    <div className="w-6" />
                  )}
                  <span className="font-medium">{category.name}</span>
                </div>
              </TableCell>
              <TableCell>{category.shortName}</TableCell>
              <TableCell>{category.code || '-'}</TableCell>
              <TableCell>
                <Badge variant={category.isActive ? 'default' : 'secondary'}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={category.isActive}
                    onCheckedChange={() => toggleActive(category.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            {isExpanded && buildTree(category.id, level + 1)}
          </React.Fragment>
        );
      });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Course Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage course categories with hierarchical structure
          </p>
        </div>
        <Button onClick={() => setIsAddEditDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buildTree()}
          </TableBody>
        </Table>
      </div>

      <AddEditCourseCategoryDialog
        isOpen={isAddEditDialogOpen}
        onClose={() => {
          setIsAddEditDialogOpen(false);
          setEditingCategory(null);
        }}
        onSave={editingCategory ? handleEdit : handleAdd}
        category={editingCategory}
        categories={categories}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
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
