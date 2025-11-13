import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Search, Plus, Play, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Reel } from "@/types/reel";
import { CreateEditReelDialog } from "@/components/reels/CreateEditReelDialog";
import { PreviewReelDialog } from "@/components/reels/PreviewReelDialog";

const STORAGE_KEY = "reels";

export default function Reels() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [selectedReels, setSelectedReels] = useState<Set<string>>(new Set());
  const [createEditDialog, setCreateEditDialog] = useState<{ open: boolean; reel?: Reel }>({
    open: false,
  });
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; reel?: Reel }>({
    open: false,
  });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedReels = localStorage.getItem(STORAGE_KEY);
    if (savedReels) {
      const parsedReels = JSON.parse(savedReels);
      setReels(
        parsedReels.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
          scheduledPublishAt: r.scheduledPublishAt ? new Date(r.scheduledPublishAt) : undefined,
          publishedAt: r.publishedAt ? new Date(r.publishedAt) : undefined,
        }))
      );
    }
  }, []);

  // Save reels to localStorage
  const saveReels = (newReels: Reel[]) => {
    setReels(newReels);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReels));
  };

  // Handle create/update reel
  const handleSaveReel = (reel: Reel) => {
    const existingIndex = reels.findIndex((r) => r.id === reel.id);
    let updatedReels;
    
    if (existingIndex >= 0) {
      updatedReels = [...reels];
      updatedReels[existingIndex] = reel;
      toast({ title: "Success", description: "Reel updated successfully" });
    } else {
      updatedReels = [reel, ...reels];
      toast({ title: "Success", description: "Reel created successfully" });
    }
    
    saveReels(updatedReels);
    setCreateEditDialog({ open: false });
  };

  // Handle delete reel
  const handleDeleteReel = (id: string) => {
    const updatedReels = reels.filter((reel) => reel.id !== id);
    saveReels(updatedReels);
    toast({ title: "Success", description: "Reel deleted successfully" });
    setDeleteDialog({ open: false, id: null });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const updatedReels = reels.filter((reel) => !selectedReels.has(reel.id));
    saveReels(updatedReels);
    setSelectedReels(new Set());
    setBulkDeleteDialog(false);
    toast({ title: "Success", description: `${selectedReels.size} reels deleted successfully` });
  };

  // Handle publish/unpublish
  const handleTogglePublish = (id: string) => {
    const updatedReels = reels.map((reel): Reel => {
      if (reel.id === id) {
        const newStatus: "active" | "inactive" = reel.status === "active" ? "inactive" : "active";
        return {
          ...reel,
          status: newStatus,
          publishedAt: newStatus === "active" ? new Date() : reel.publishedAt,
          updatedAt: new Date(),
        };
      }
      return reel;
    });
    saveReels(updatedReels);
    toast({
      title: "Success",
      description: `Reel ${updatedReels.find((r) => r.id === id)?.status === "active" ? "published" : "unpublished"} successfully`,
    });
  };

  // Handle bulk publish/unpublish
  const handleBulkTogglePublish = (publish: boolean) => {
    const updatedReels = reels.map((reel) => {
      if (selectedReels.has(reel.id)) {
        return {
          ...reel,
          status: publish ? ("active" as const) : ("inactive" as const),
          publishedAt: publish ? new Date() : reel.publishedAt,
          updatedAt: new Date(),
        };
      }
      return reel;
    });
    saveReels(updatedReels);
    setSelectedReels(new Set());
    toast({
      title: "Success",
      description: `${selectedReels.size} reels ${publish ? "published" : "unpublished"} successfully`,
    });
  };

  // Filter reels
  const filteredReels = reels.filter((reel) => {
    const matchesSearch = reel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reel.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || reel.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || reel.status === statusFilter;
    const matchesLanguage = languageFilter === "all" || reel.language === languageFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLanguage;
  });

  // Get unique categories, languages
  const categories = Array.from(new Set(reels.map((r) => r.category)));
  const languages = Array.from(new Set(reels.map((r) => r.language)));

  // Sort by newest first
  const sortedReels = [...filteredReels].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Select/deselect all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReels(new Set(sortedReels.map((r) => r.id)));
    } else {
      setSelectedReels(new Set());
    }
  };

  const handleSelectReel = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedReels);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedReels(newSelected);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
              <BreadcrumbPage>Reels</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reels</h1>
            <p className="text-muted-foreground mt-1">
              Manage bite-sized learning content
            </p>
          </div>
          <Button onClick={() => setCreateEditDialog({ open: true })} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Reel
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Reels</div>
            <div className="text-2xl font-bold mt-2">{reels.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Active</div>
            <div className="text-2xl font-bold mt-2">
              {reels.filter((r) => r.status === "active").length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Views</div>
            <div className="text-2xl font-bold mt-2">
              {reels.reduce((sum, r) => sum + r.views, 0)}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Total Likes</div>
            <div className="text-2xl font-bold mt-2">
              {reels.reduce((sum, r) => sum + r.likes, 0)}
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Bulk Actions */}
        {selectedReels.size > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedReels.size} selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkTogglePublish(true)}
                >
                  Publish Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkTogglePublish(false)}
                >
                  Unpublish Selected
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setBulkDeleteDialog(true)}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Reels Grid */}
        {sortedReels.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-muted-foreground">
              No reels found. Create your first reel to get started.
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedReels.map((reel) => (
              <Card
                key={reel.id}
                className="group relative overflow-hidden aspect-square cursor-pointer transition-all hover:shadow-lg"
              >
                {/* Thumbnail */}
                <div className="absolute inset-0 bg-muted">
                  {reel.thumbnailUrl ? (
                    <img
                      src={reel.thumbnailUrl}
                      alt={reel.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedReels.has(reel.id)}
                    onCheckedChange={(checked) =>
                      handleSelectReel(reel.id, checked as boolean)
                    }
                    className="bg-background"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setPreviewDialog({ open: true, reel })}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setCreateEditDialog({ open: true, reel })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleTogglePublish(reel.id)}
                    >
                      {reel.status === "active" ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setDeleteDialog({ open: true, id: reel.id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                  <div className="text-sm font-medium line-clamp-1">{reel.title}</div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span>{formatDuration(reel.duration)}</span>
                    <Badge
                      variant={
                        reel.status === "active"
                          ? "default"
                          : reel.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {reel.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs opacity-80">
                    <span>👁️ {reel.views}</span>
                    <span>❤️ {reel.likes}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Select All */}
        {sortedReels.length > 0 && (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedReels.size === sortedReels.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <CreateEditReelDialog
        open={createEditDialog.open}
        reel={createEditDialog.reel}
        onClose={() => setCreateEditDialog({ open: false })}
        onSave={handleSaveReel}
      />

      {/* Preview Dialog */}
      <PreviewReelDialog
        open={previewDialog.open}
        reel={previewDialog.reel}
        onClose={() => setPreviewDialog({ open: false })}
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
              This action cannot be undone. This will permanently delete the reel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.id && handleDeleteReel(deleteDialog.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialog} onOpenChange={setBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedReels.size} reels?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected reels.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
