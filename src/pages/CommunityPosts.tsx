import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, Languages, Search, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CommunityPost, CommunityCategory } from "@/types/communityPost";
import { AddEditCategoryDialog } from "@/components/community/AddEditCategoryDialog";
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

const STORAGE_KEYS = {
  POSTS: "communityPosts",
  CATEGORIES: "communityCategories",
  SUBTITLE: "communitySubtitle",
};

const DEFAULT_SUBTITLE = "A global platform connecting professionals and experts for knowledge sharing, collaboration, and growth in digital learning.";

const DEFAULT_CATEGORIES: CommunityCategory[] = [
  { id: "1", name: "Blog", color: "#3B82F6", createdAt: new Date() },
  { id: "2", name: "News", color: "#10B981", createdAt: new Date() },
  { id: "3", name: "Acado Connect", color: "#8B5CF6", createdAt: new Date() },
];

export default function CommunityPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null; type: "post" | "category" }>({
    open: false,
    id: null,
    type: "post",
  });

  // Load data from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem(STORAGE_KEYS.POSTS);
    const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const savedSubtitle = localStorage.getItem(STORAGE_KEYS.SUBTITLE);

    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (savedSubtitle) setSubtitle(savedSubtitle);
  }, []);

  // Save data to localStorage
  const savePosts = (newPosts: CommunityPost[]) => {
    setPosts(newPosts);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts));
  };

  const saveCategories = (newCategories: CommunityCategory[]) => {
    setCategories(newCategories);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));
  };

  const saveSubtitle = () => {
    localStorage.setItem(STORAGE_KEYS.SUBTITLE, subtitle);
    setIsEditingSubtitle(false);
    toast({ title: "Success", description: "Subtitle updated successfully" });
  };

  // Category management
  const handleSaveCategory = (category: CommunityCategory) => {
    const existingIndex = categories.findIndex((c) => c.id === category.id);
    if (existingIndex >= 0) {
      const updated = [...categories];
      updated[existingIndex] = category;
      saveCategories(updated);
    } else {
      saveCategories([...categories, category]);
    }
  };

  const handleDeleteCategory = () => {
    if (!deleteDialog.id) return;
    
    const postsInCategory = posts.filter(p => p.categoryId === deleteDialog.id);
    if (postsInCategory.length > 0) {
      toast({
        title: "Error",
        description: `Cannot delete category with ${postsInCategory.length} post(s). Please reassign or delete the posts first.`,
        variant: "destructive",
      });
      setDeleteDialog({ open: false, id: null, type: "category" });
      return;
    }

    saveCategories(categories.filter((c) => c.id !== deleteDialog.id));
    setDeleteDialog({ open: false, id: null, type: "category" });
    toast({ title: "Success", description: "Category deleted successfully" });
  };

  // Post management
  const handleDeletePost = () => {
    if (!deleteDialog.id) return;
    savePosts(posts.filter((p) => p.id !== deleteDialog.id));
    setDeleteDialog({ open: false, id: null, type: "post" });
    toast({ title: "Success", description: "Post deleted successfully" });
  };

  // Filter and search
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.categoryId === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort posts: pinned first, then by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + itemsPerPage);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#3B82F6";
  };

  const stats = {
    totalCategories: categories.length,
    totalPosts: posts.length,
    activePosts: posts.filter(p => !p.isPinned).length,
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Welcome</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Community Post</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Community Post</h1>
        {isEditingSubtitle ? (
          <div className="flex gap-2 items-start">
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="max-w-3xl"
              placeholder="Enter subtitle"
            />
            <Button onClick={saveSubtitle} size="sm">Save</Button>
            <Button onClick={() => {
              setIsEditingSubtitle(false);
              const saved = localStorage.getItem(STORAGE_KEYS.SUBTITLE);
              setSubtitle(saved || DEFAULT_SUBTITLE);
            }} variant="outline" size="sm">Cancel</Button>
          </div>
        ) : (
          <p 
            className="text-muted-foreground max-w-3xl cursor-pointer hover:text-foreground transition-colors"
            onClick={() => setIsEditingSubtitle(true)}
            title="Click to edit"
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <AddEditCategoryDialog onSave={handleSaveCategory} />
        <Button onClick={() => navigate("/communities/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Categories</div>
          <div className="text-2xl font-bold mt-1">{stats.totalCategories}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Posts</div>
          <div className="text-2xl font-bold mt-1">{stats.totalPosts}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Active Posts</div>
          <div className="text-2xl font-bold mt-1">{stats.activePosts}</div>
        </Card>
      </div>

      {/* Categories Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              <span className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search and Items Per Page */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts by name or description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="25">25 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Content Type</TableHead>
              <TableHead className="max-w-md">Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No posts found. Create your first post to get started.
                </TableCell>
              </TableRow>
            ) : (
              paginatedPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Link 
                      to={`/communities/edit/${post.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      style={{ 
                        backgroundColor: `${getCategoryColor(post.categoryId)}20`,
                        color: getCategoryColor(post.categoryId),
                        borderColor: getCategoryColor(post.categoryId)
                      }}
                      className="border"
                    >
                      {getCategoryName(post.categoryId)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.contentType}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div 
                      className="text-sm text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.description.substring(0, 150) }}
                    />
                  </TableCell>
                  <TableCell>
                    {post.isPinned && (
                      <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50">
                        Pinned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/communities/edit/${post.id}`)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteDialog({ open: true, id: post.id, type: "post" })}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Translate"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedPosts.length)} of{" "}
            {sortedPosts.length} posts
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deleteDialog.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteDialog.type === "post" ? handleDeletePost : handleDeleteCategory}
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
