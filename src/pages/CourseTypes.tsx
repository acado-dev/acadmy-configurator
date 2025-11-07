import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { CourseType } from "@/types/courseType";
import AddEditCourseTypeDialog from "@/components/courseTypes/AddEditCourseTypeDialog";

const STORAGE_KEY = "acado_course_types";

const sampleTypes: CourseType[] = [
  {
    id: "1",
    name: "Full Time",
    shortName: "FT",
    description: "Full-time study programs",
    keywords: "full-time, regular, standard",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Pathway",
    shortName: "PW",
    description: "Pathway programs for international students",
    keywords: "pathway, foundation, preparatory",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Exchange",
    shortName: "EX",
    description: "Student exchange programs",
    keywords: "exchange, abroad, international",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Immersion",
    shortName: "IM",
    description: "Immersion programs for cultural and language learning",
    keywords: "immersion, cultural, language",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const CourseTypes = () => {
  const [types, setTypes] = useState<CourseType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<CourseType | null>(null);
  const [deletingType, setDeletingType] = useState<CourseType | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTypes(JSON.parse(stored));
    } else {
      setTypes(sampleTypes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTypes));
    }
  }, []);

  const saveTypes = (updatedTypes: CourseType[]) => {
    setTypes(updatedTypes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTypes));
  };

  const handleAdd = (typeData: Omit<CourseType, "id" | "createdAt" | "updatedAt">) => {
    const newType: CourseType = {
      ...typeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTypes([...types, newType]);
  };

  const handleEdit = (typeData: Omit<CourseType, "id" | "createdAt" | "updatedAt">) => {
    if (!editingType) return;
    
    const updatedTypes = types.map((t) =>
      t.id === editingType.id
        ? { ...t, ...typeData, updatedAt: new Date().toISOString() }
        : t
    );
    saveTypes(updatedTypes);
    setEditingType(null);
  };

  const handleDelete = () => {
    if (!deletingType) return;
    saveTypes(types.filter((t) => t.id !== deletingType.id));
    setDeletingType(null);
  };

  const toggleActive = (id: string) => {
    const updatedTypes = types.map((t) =>
      t.id === id
        ? { ...t, isActive: !t.isActive, updatedAt: new Date().toISOString() }
        : t
    );
    saveTypes(updatedTypes);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Course Types</h1>
          <p className="text-muted-foreground mt-1">
            Manage course types and their properties
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course Type
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Keywords</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No course types found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.shortName}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {type.description || "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {type.keywords || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={type.isActive ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleActive(type.id)}
                    >
                      {type.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingType(type)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingType(type)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddEditCourseTypeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAdd}
      />

      <AddEditCourseTypeDialog
        isOpen={!!editingType}
        onClose={() => setEditingType(null)}
        onSave={handleEdit}
        type={editingType || undefined}
      />

      <AlertDialog open={!!deletingType} onOpenChange={() => setDeletingType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course type "{deletingType?.name}".
              This action cannot be undone.
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
};

export default CourseTypes;
