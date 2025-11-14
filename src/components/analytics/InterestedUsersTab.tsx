import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  GraduationCap,
  Search,
  Download,
  Mail,
  Tag,
  Eye,
  Filter,
  X,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const educationLevels = [
  { level: 'School Final', count: 1245, icon: '🎓' },
  { level: 'Higher Secondary', count: 2356, icon: '📚' },
  { level: "Bachelor's", count: 4532, icon: '🎯' },
  { level: "Master's", count: 2134, icon: '🏆' },
  { level: 'Degree/Diploma', count: 1890, icon: '📜' },
];

const mockUsers = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'r***l@example.com',
    mobile: '+91-98***-**456',
    organization: 'Tech University',
    educationQualification: "Bachelor's",
    interestedCategories: ['AI & ML', 'Data Science'],
    dateOfInterest: '2024-01-15',
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'p***a@example.com',
    mobile: '+91-97***-**234',
    organization: 'Business School',
    educationQualification: "Master's",
    interestedCategories: ['Business Leadership', 'Management'],
    dateOfInterest: '2024-01-14',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'a***t@example.com',
    mobile: '+91-96***-**789',
    organization: 'Engineering College',
    educationQualification: "Bachelor's",
    interestedCategories: ['Web Development', 'Mobile Apps'],
    dateOfInterest: '2024-01-13',
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 's***a@example.com',
    mobile: '+91-95***-**567',
    organization: 'Medical Institute',
    educationQualification: 'Degree/Diploma',
    interestedCategories: ['Healthcare', 'Diagnostics'],
    dateOfInterest: '2024-01-12',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'v***m@example.com',
    mobile: '+91-94***-**890',
    organization: 'Arts College',
    educationQualification: 'Higher Secondary',
    interestedCategories: ['Creativity & Arts', 'Design'],
    dateOfInterest: '2024-01-11',
  },
];

export default function InterestedUsersTab() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    education: 'all',
    category: 'all',
    organization: 'all',
  });
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === mockUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(mockUsers.map((u) => u.id));
    }
  };

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: `Exporting ${selectedUsers.length > 0 ? selectedUsers.length : mockUsers.length} user records as CSV...`,
    });

    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: 'Interested users data has been exported successfully.',
      });
    }, 2000);
  };

  const handleSendEmail = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No Users Selected',
        description: 'Please select users to send email.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Email Campaign',
      description: `Opening email composer for ${selectedUsers.length} selected users...`,
    });
  };

  const clearFilters = () => {
    setFilters({ education: 'all', category: 'all', organization: 'all' });
    setDateRange({});
    setSearchQuery('');
  };

  const activeFiltersCount = [
    filters.education !== 'all',
    filters.category !== 'all',
    filters.organization !== 'all',
    dateRange.start || dateRange.end,
    searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Education Level Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {educationLevels.map((level) => (
          <Card key={level.level} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl">{level.icon}</div>
                <p className="text-2xl font-bold">{level.count.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{level.level}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Interested Users Database</CardTitle>
              <CardDescription>
                Manage and export user interest data with advanced filtering
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filters.education} onValueChange={(value) => setFilters({ ...filters, education: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Education Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Education Levels</SelectItem>
                <SelectItem value="school">School Final</SelectItem>
                <SelectItem value="higher">Higher Secondary</SelectItem>
                <SelectItem value="bachelor">Bachelor's</SelectItem>
                <SelectItem value="master">Master's</SelectItem>
                <SelectItem value="diploma">Degree/Diploma</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ai">AI & ML</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="arts">Arts & Creativity</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.organization} onValueChange={(value) => setFilters({ ...filters, organization: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                <SelectItem value="tech">Tech University</SelectItem>
                <SelectItem value="business">Business School</SelectItem>
                <SelectItem value="engineering">Engineering College</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.start}
                  onSelect={(date) => date && setDateRange({ ...dateRange, start: date })}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2 ml-auto">
                <Button size="sm" variant="outline" onClick={handleSendEmail}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button size="sm" variant="outline">
                  <Tag className="w-4 h-4 mr-2" />
                  Add Tags
                </Button>
                <Button size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Selected
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Records</CardTitle>
              <CardDescription>Showing {mockUsers.length} interested users</CardDescription>
            </div>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export All CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === mockUsers.length}
                      onCheckedChange={toggleAllUsers}
                    />
                  </TableHead>
                  <TableHead>#</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile No</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Interested In</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user, idx) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="text-muted-foreground">{user.mobile}</TableCell>
                    <TableCell>{user.organization}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.educationQualification}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.interestedCategories.map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(user.dateOfInterest), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Tag className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1 to {mockUsers.length} of 12,847 users
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
