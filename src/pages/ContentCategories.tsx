import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Languages } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WallCategory } from "@/types/wallCategory";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import AddEditContentCategoryDialog from "@/components/contentCategories/AddEditContentCategoryDialog";

const STORAGE_KEY = "wallCategories";

const sampleCategories: WallCategory[] = [
  {
    id: "1",
    name: "The Finland Nursing Mentorship Track",
    language: "English",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Nursing Top-Up Degree Community",
    language: "English",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Acado Connect",
    language: "English",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "News",
    language: "English",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Blog",
    language: "English",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Carvaan",
    language: "English",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function ContentCategories() {
  const [categories, setCategories] = useState<WallCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<WallCategory | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setCategories(
        parsed.map((cat: any) => ({
          ...cat,
          createdAt: new Date(cat.createdAt),
          updatedAt: new Date(cat.updatedAt),
        }))
      );
    } else {
      setCategories(sampleCategories);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCategories));
    }
  }, []);

  const saveCategories = (newCategories: WallCategory[]) => {
    setCategories(newCategories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
  };

  const handleAdd = () => {
    setEditingCategory(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: WallCategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleSave = (
    categoryData: Omit<WallCategory, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => {
    if (categoryData.id) {
      // Edit existing
      const updated = categories.map((cat) =>
        cat.id === categoryData.id
          ? { ...cat, ...categoryData, updatedAt: new Date() }
          : cat
      );
      saveCategories(updated);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } else {
      // Add new
      const newCategory: WallCategory = {
        ...categoryData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      saveCategories([...categories, newCategory]);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    }
  };

  const handleDelete = (id: string) => {
    const updated = categories.filter((cat) => cat.id !== id);
    saveCategories(updated);
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Communities</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
          </div>
          <Button onClick={handleAdd} className="bg-primary">
            Add
          </Button>
        </div>

        {/* Categories Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    No categories found. Create your first category to get started.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-primary">{category.language}</TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          className="text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteDialog({ open: true, id: category.id })}
                          className="text-primary"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary"
                        >
                          <Languages className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <AddEditContentCategoryDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        category={editingCategory}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.id && handleDelete(deleteDialog.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
