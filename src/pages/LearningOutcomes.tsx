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
import { LearningOutcome } from '@/types/learningOutcome';
import { AddEditLearningOutcomeDialog } from '@/components/learningOutcomes/AddEditLearningOutcomeDialog';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'learningOutcomes';

// Sample data
const sampleOutcomes: LearningOutcome[] = [
  {
    id: '1',
    name: 'Critical Thinking',
    shortName: 'CRIT-THINK',
    code: 'CT',
    parentId: null,
    description: 'Develop critical thinking and analytical skills',
    keywords: 'critical thinking, analysis, problem solving',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Problem Analysis',
    shortName: 'PROB-ANAL',
    code: 'PA',
    parentId: '1',
    description: 'Ability to analyze complex problems',
    keywords: 'analysis, problem, decomposition',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Solution Design',
    shortName: 'SOL-DESIGN',
    code: 'SD',
    parentId: '2',
    description: 'Design effective solutions to identified problems',
    keywords: 'design, solution, implementation',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Communication Skills',
    shortName: 'COMM',
    code: 'CS',
    parentId: null,
    description: 'Effective communication and presentation skills',
    keywords: 'communication, presentation, writing',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Technical Writing',
    shortName: 'TECH-WRITE',
    code: 'TW',
    parentId: '4',
    description: 'Ability to write technical documentation',
    keywords: 'writing, documentation, technical',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function LearningOutcomes() {
  const [outcomes, setOutcomes] = useState<LearningOutcome[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<LearningOutcome | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [outcomeToDelete, setOutcomeToDelete] = useState<LearningOutcome | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setOutcomes(JSON.parse(stored));
    } else {
      setOutcomes(sampleOutcomes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleOutcomes));
    }
  }, []);

  const saveOutcomes = (updatedOutcomes: LearningOutcome[]) => {
    setOutcomes(updatedOutcomes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOutcomes));
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

  const handleAdd = (outcome: Omit<LearningOutcome, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOutcome: LearningOutcome = {
      ...outcome,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveOutcomes([...outcomes, newOutcome]);
    toast({
      title: 'Success',
      description: 'Learning outcome added successfully',
    });
  };

  const handleEdit = (outcome: Omit<LearningOutcome, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingOutcome) return;
    
    const updated = outcomes.map((o) =>
      o.id === editingOutcome.id
        ? { ...outcome, id: o.id, createdAt: o.createdAt, updatedAt: new Date().toISOString() }
        : o
    );
    saveOutcomes(updated);
    setEditingOutcome(null);
    toast({
      title: 'Success',
      description: 'Learning outcome updated successfully',
    });
  };

  const handleDelete = () => {
    if (!outcomeToDelete) return;

    // Check if outcome has children
    const hasChildren = outcomes.some((o) => o.parentId === outcomeToDelete.id);
    if (hasChildren) {
      toast({
        title: 'Error',
        description: 'Cannot delete learning outcome with sub-outcomes',
        variant: 'destructive',
      });
      setDeleteDialogOpen(false);
      return;
    }

    const updated = outcomes.filter((o) => o.id !== outcomeToDelete.id);
    saveOutcomes(updated);
    setDeleteDialogOpen(false);
    setOutcomeToDelete(null);
    toast({
      title: 'Success',
      description: 'Learning outcome deleted successfully',
    });
  };

  const toggleActive = (id: string) => {
    const updated = outcomes.map((o) =>
      o.id === id ? { ...o, isActive: !o.isActive, updatedAt: new Date().toISOString() } : o
    );
    saveOutcomes(updated);
    toast({
      title: 'Success',
      description: 'Learning outcome status updated',
    });
  };

  const openEditDialog = (outcome: LearningOutcome) => {
    setEditingOutcome(outcome);
    setIsAddEditDialogOpen(true);
  };

  const openDeleteDialog = (outcome: LearningOutcome) => {
    setOutcomeToDelete(outcome);
    setDeleteDialogOpen(true);
  };

  // Build hierarchical structure
  const buildTree = (parentId: string | null = null, level: number = 0): JSX.Element[] => {
    return outcomes
      .filter((o) => o.parentId === parentId)
      .map((outcome) => {
        const hasChildren = outcomes.some((o) => o.parentId === outcome.id);
        const isExpanded = expandedIds.has(outcome.id);

        return (
          <React.Fragment key={outcome.id}>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
                  {hasChildren ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleExpand(outcome.id)}
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
                  <span className="font-medium">{outcome.name}</span>
                </div>
              </TableCell>
              <TableCell>{outcome.shortName}</TableCell>
              <TableCell>{outcome.code || '-'}</TableCell>
              <TableCell>
                <Badge variant={outcome.isActive ? 'default' : 'secondary'}>
                  {outcome.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={outcome.isActive}
                    onCheckedChange={() => toggleActive(outcome.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(outcome)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(outcome)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            {isExpanded && buildTree(outcome.id, level + 1)}
          </React.Fragment>
        );
      });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Learning Outcomes</h1>
          <p className="text-muted-foreground mt-1">
            Manage learning outcomes with hierarchical structure
          </p>
        </div>
        <Button onClick={() => setIsAddEditDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Learning Outcome
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

      <AddEditLearningOutcomeDialog
        isOpen={isAddEditDialogOpen}
        onClose={() => {
          setIsAddEditDialogOpen(false);
          setEditingOutcome(null);
        }}
        onSave={editingOutcome ? handleEdit : handleAdd}
        outcome={editingOutcome}
        outcomes={outcomes}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Learning Outcome</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{outcomeToDelete?.name}"? This action cannot be undone.
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
