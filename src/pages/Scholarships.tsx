import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Eye, Edit, Trash2, Award, Users, TrendingUp, Calendar, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "@/hooks/use-toast";
import { Scholarship } from "@/types/scholarship";

const Scholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // Load scholarships from localStorage
  const loadScholarships = (): Scholarship[] => {
    const stored = localStorage.getItem("scholarships");
    return stored ? JSON.parse(stored) : [];
  };

  const [scholarships, setScholarships] = useState<Scholarship[]>(loadScholarships());

  const handleDelete = () => {
    if (selectedScholarship) {
      const updatedScholarships = scholarships.filter((s) => s.id !== selectedScholarship.id);
      setScholarships(updatedScholarships);
      localStorage.setItem("scholarships", JSON.stringify(updatedScholarships));
      toast({
        title: "Scholarship deleted",
        description: "The scholarship has been successfully deleted.",
      });
      setDeleteDialogOpen(false);
      setSelectedScholarship(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      active: "default",
      inactive: "outline",
      completed: "outline",
      cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      merit: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      need_based: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      full: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      fellowship: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      travel_grant: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    };
    return (
      <Badge className={`capitalize ${colors[type] || ""}`}>
        {type.replace("_", " ")}
      </Badge>
    );
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = 
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || scholarship.status === statusFilter;
    const matchesType = typeFilter === "all" || scholarship.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate dashboard metrics
  const totalScholarships = scholarships.length;
  const activeScholarships = scholarships.filter(s => s.status === "active").length;
  const draftScholarships = scholarships.filter(s => s.status === "draft").length;
  const inactiveScholarships = scholarships.filter(s => s.status === "inactive").length;
  
  // Upcoming deadlines (within 7 days)
  const upcomingDeadlines = scholarships.filter(s => {
    const deadline = new Date(s.applicationDeadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7 && s.status === "active";
  }).length;
  
  const totalApplications = scholarships.reduce((sum, s) => sum + (s.applications || 0), 0);
  const avgApplications = totalScholarships > 0 ? Math.round(totalApplications / totalScholarships) : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scholarships</h1>
          <p className="text-muted-foreground mt-1">
            Manage scholarship programs and track applications
          </p>
        </div>
        <Link to="/scholarships/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Scholarship
          </Button>
        </Link>
      </div>

      {/* Mini Dashboard */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScholarships}</div>
            <p className="text-xs text-muted-foreground">Scholarships</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeScholarships}</div>
            <p className="text-xs text-muted-foreground">Open for applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftScholarships}</div>
            <p className="text-xs text-muted-foreground">Not published yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveScholarships}</div>
            <p className="text-xs text-muted-foreground">Closed or expired</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">Avg: {avgApplications}/scholarship</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Scholarships</CardTitle>
          <CardDescription>View and manage scholarship programs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, provider, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="merit">Merit</SelectItem>
                <SelectItem value="need_based">Need-based</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="fellowship">Fellowship</SelectItem>
                <SelectItem value="travel_grant">Travel Grant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thumb</TableHead>
                  <TableHead>Scholarship Name</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScholarships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No scholarships found. Create your first scholarship to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredScholarships.map((scholarship) => (
                    <TableRow key={scholarship.id}>
                      <TableCell>
                        {scholarship.thumbnailUrl ? (
                          <img 
                            src={scholarship.thumbnailUrl} 
                            alt={scholarship.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                            <Award className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{scholarship.title}</TableCell>
                      <TableCell>{scholarship.providerName}</TableCell>
                      <TableCell>{getTypeBadge(scholarship.type)}</TableCell>
                      <TableCell className="font-semibold">
                        {scholarship.currency} {scholarship.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{scholarship.applications || 0}</TableCell>
                      <TableCell>{getStatusBadge(scholarship.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Report">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link to={`/scholarships/edit/${scholarship.id}`}>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            onClick={() => {
                              setSelectedScholarship(scholarship);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredScholarships.length} of {scholarships.length} scholarships
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedScholarship?.title}"? This action cannot be undone.
              All applications and data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Scholarships;
