import { useState, useEffect } from "react";
import { Search, Download, FileText, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { User } from "@/types/user";
import { sampleUsers } from "@/data/sampleUsers";
import {
  Assessment,
  Assignment,
  LoginHistory,
  FailedLogin,
  ProgramEnrollment,
  LearningProgress,
  UserDetail,
} from "@/types/userActivity";

// Mock data generators
const generateAssessments = (): Assessment[] => [
  {
    id: "1",
    title: "React Fundamentals Quiz",
    courseName: "Web Development Basics",
    status: "Completed",
    score: 85,
    maxScore: 100,
    attempts: 2,
    deadline: "2024-01-15",
    completedAt: "2024-01-14",
  },
  {
    id: "2",
    title: "JavaScript Advanced Test",
    courseName: "Advanced JavaScript",
    status: "In Progress",
    maxScore: 100,
    attempts: 1,
    deadline: "2024-02-01",
  },
  {
    id: "3",
    title: "TypeScript Basics",
    courseName: "TypeScript Mastery",
    status: "Not Started",
    maxScore: 100,
    attempts: 0,
    deadline: "2024-02-15",
  },
];

const generateAssignments = (): Assignment[] => [
  {
    id: "1",
    title: "Build a Todo App",
    courseName: "React Development",
    status: "Graded",
    dueDate: "2024-01-20",
    submittedAt: "2024-01-19",
    grade: "A",
    score: 92,
    maxScore: 100,
    attachments: ["todo-app.zip"],
  },
  {
    id: "2",
    title: "API Integration Project",
    courseName: "Backend Development",
    status: "Submitted",
    dueDate: "2024-01-30",
    submittedAt: "2024-01-28",
    maxScore: 100,
    attachments: ["api-project.zip", "documentation.pdf"],
  },
  {
    id: "3",
    title: "Database Design Task",
    courseName: "Database Management",
    status: "Not Submitted",
    dueDate: "2024-02-10",
    maxScore: 100,
  },
];

const generateLoginHistory = (): LoginHistory[] => [
  {
    id: "1",
    timestamp: "2024-01-26 14:30:00",
    deviceType: "Desktop - Chrome",
    location: "Mumbai, India",
    ipAddress: "103.21.45.67",
    status: "Success",
  },
  {
    id: "2",
    timestamp: "2024-01-25 09:15:00",
    deviceType: "Mobile - Safari",
    location: "Mumbai, India",
    ipAddress: "103.21.45.68",
    status: "Success",
  },
  {
    id: "3",
    timestamp: "2024-01-24 18:45:00",
    deviceType: "Desktop - Firefox",
    location: "Pune, India",
    ipAddress: "103.21.45.69",
    status: "Success",
  },
];

const generateFailedLogins = (): FailedLogin[] => [
  {
    id: "1",
    timestamp: "2024-01-23 10:30:00",
    method: "Email/Password",
    reason: "Incorrect Password",
    ipAddress: "103.21.45.70",
    deviceType: "Desktop - Chrome",
  },
  {
    id: "2",
    timestamp: "2024-01-20 15:45:00",
    method: "Email/Password",
    reason: "Account Locked",
    ipAddress: "103.21.45.71",
    deviceType: "Mobile - Chrome",
  },
];

const generateEnrollments = (): ProgramEnrollment[] => [
  {
    id: "1",
    programName: "Full Stack Development",
    enrolledAt: "2023-09-01",
    status: "Active",
    progress: 65,
  },
  {
    id: "2",
    programName: "Data Science Fundamentals",
    enrolledAt: "2023-08-15",
    status: "Completed",
    progress: 100,
    certificateId: "CERT-2024-001",
  },
  {
    id: "3",
    programName: "Cloud Computing Basics",
    enrolledAt: "2023-07-01",
    status: "Expired",
    progress: 30,
  },
];

const generateLearningProgress = (): LearningProgress => ({
  totalEnrolled: 8,
  totalCompleted: 3,
  certificatesEarned: 3,
  activeEnrollments: 4,
  expiredEnrollments: 1,
});

const generateUserDetails = (): UserDetail => ({
  enrollmentNumber: "EN2023001234",
  department: "Computer Science",
  abcId: "ABC123456789",
  aadhaarNumber: "XXXX-XXXX-1234",
  fatherName: "Rajesh Kumar",
  fatherOccupation: "Business",
  fatherContact: "+91-98XXXXXXXX",
  fatherEmail: "rajesh.k@example.com",
  motherName: "Priya Kumar",
  motherOccupation: "Teacher",
  motherContact: "+91-97XXXXXXXX",
  motherEmail: "priya.k@example.com",
  guardianName: "N/A",
  guardianOccupation: "N/A",
  guardianContact: "N/A",
  guardianEmail: "N/A",
  expertise: "Web Development, Mobile Apps",
});

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeView, setActiveView] = useState<'details' | 'assessments' | 'assignments' | 'login' | 'failed' | 'programs'>('details');
  const [searchType, setSearchType] = useState<'name' | 'email' | 'mobile' | 'enrollment'>('email');

  // Initialize users with IDs from sample data
  useEffect(() => {
    const usersWithIds: User[] = sampleUsers.map(user => ({
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setAllUsers(usersWithIds);
    
    // Auto-select first user to show the interface immediately
    if (usersWithIds.length > 0) {
      setSelectedUser(usersWithIds[0]);
    }
  }, []);

  // Collapsible states
  const [openSections, setOpenSections] = useState({
    personal: true,
    expertise: false,
    student: false,
    father: false,
    mother: false,
    guardian: false,
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    const results = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.mobileNo?.toLowerCase().includes(query) ||
        user.studentIdStaffId?.toLowerCase().includes(query)
    );

    setSearchResults(results);
    setShowResults(true);
    if (results.length === 1) {
      setSelectedUser(results[0]);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowResults(false);
  };

  const handleExport = (format: "pdf" | "csv") => {
    console.log(`Exporting user data as ${format}`);
    // Mock export functionality
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const assessments = generateAssessments();
  const assignments = generateAssignments();
  const loginHistory = generateLoginHistory();
  const failedLogins = generateFailedLogins();
  const enrollments = generateEnrollments();
  const learningProgress = generateLearningProgress();
  const userDetails = generateUserDetails();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Search & Insight Console</h1>
          <p className="text-muted-foreground mt-2">
            Search and manage learner profiles across the system
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by Name, Email, Mobile Number, or Enrollment Number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} variant="default">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results List */}
        {showResults && searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({searchResults.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {user.organization} • {user.userType}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {showResults && searchResults.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No users found matching your search.</p>
            </CardContent>
          </Card>
        )}

        {/* User Detail Dashboard */}
        {selectedUser && (
          <div className="space-y-6">
            {/* User Overview */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">Student Details</CardTitle>
                    <div className="flex gap-4 mt-3 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="searchType" 
                          checked={searchType === 'name'}
                          onChange={() => setSearchType('name')}
                          className="cursor-pointer"
                        />
                        <span className="text-foreground">Name</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="searchType" 
                          checked={searchType === 'email'}
                          onChange={() => setSearchType('email')}
                          className="cursor-pointer"
                        />
                        <span className="text-foreground">Email</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="searchType" 
                          checked={searchType === 'mobile'}
                          onChange={() => setSearchType('mobile')}
                          className="cursor-pointer"
                        />
                        <span className="text-foreground">Mobile No</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="searchType" 
                          checked={searchType === 'enrollment'}
                          onChange={() => setSearchType('enrollment')}
                          className="cursor-pointer"
                        />
                        <span className="text-foreground">Enrollment No</span>
                      </label>
                    </div>
                    <p className="text-foreground mt-3 font-medium">{selectedUser.email}</p>
                  </div>
                  <Avatar className="h-28 w-28">
                    <AvatarFallback className="bg-muted text-foreground text-3xl">
                      {selectedUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={activeView === 'details' ? 'default' : 'secondary'} 
                    size="sm"
                    onClick={() => setActiveView('details')}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant={activeView === 'assessments' ? 'default' : 'secondary'} 
                    size="sm"
                    onClick={() => setActiveView('assessments')}
                  >
                    View Assessment
                  </Button>
                  <Button 
                    variant={activeView === 'assignments' ? 'default' : 'secondary'} 
                    size="sm"
                    onClick={() => setActiveView('assignments')}
                  >
                    View Assignments
                  </Button>
                  <Button 
                    variant={activeView === 'login' ? 'default' : 'secondary'} 
                    size="sm"
                    onClick={() => setActiveView('login')}
                  >
                    Login History
                  </Button>
                  <Button 
                    variant={activeView === 'failed' ? 'default' : 'secondary'} 
                    size="sm"
                    onClick={() => setActiveView('failed')}
                  >
                    Failed Logins
                  </Button>
                  <Button 
                    variant={activeView === 'programs' ? 'default' : 'secondary'} 
                    size="sm"
                    onClick={() => setActiveView('programs')}
                  >
                    Assign Program
                  </Button>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Reset Password
                  </Button>
                  <Button variant="outline" size="sm">
                    Make Mentor
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Content Based on Active View */}
            {activeView === 'details' && (
              <div className="space-y-4">
                    {/* Personal Details */}
                    <Collapsible
                      open={openSections.personal}
                      onOpenChange={() => toggleSection("personal")}
                    >
                      <Card className="border-l-4 border-l-primary">
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Personal Details</CardTitle>
                            {openSections.personal ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Name:</span>
                              <p className="text-foreground">{selectedUser.name}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Email:</span>
                              <p className="text-foreground">{selectedUser.email}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Alternate Email:
                              </span>
                              <p className="text-muted-foreground">N/A</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Mobile Number:
                              </span>
                              <p className="text-foreground">{selectedUser.mobileNo || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Address:</span>
                              <p className="text-foreground">{selectedUser.address || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Date of Birth:
                              </span>
                              <p className="text-foreground">{selectedUser.dateOfBirth || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Role:</span>
                              <p className="text-foreground">{selectedUser.userType}</p>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    {/* User Expertise */}
                    <Collapsible
                      open={openSections.expertise}
                      onOpenChange={() => toggleSection("expertise")}
                    >
                      <Card className="border-l-4 border-l-blue-500">
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">User Expertise</CardTitle>
                            {openSections.expertise ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent>
                            <p className="text-foreground">{userDetails.expertise}</p>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    {/* Student Details */}
                    <Collapsible
                      open={openSections.student}
                      onOpenChange={() => toggleSection("student")}
                    >
                      <Card className="border-l-4 border-l-purple-500">
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Student Details</CardTitle>
                            {openSections.student ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Full Name:
                              </span>
                              <p className="text-foreground">{selectedUser.name}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Enrollment Number:
                              </span>
                              <p className="text-foreground">{userDetails.enrollmentNumber}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Department:
                              </span>
                              <p className="text-foreground">{userDetails.department}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">ABC ID:</span>
                              <p className="text-foreground">{userDetails.abcId}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Aadhaar Number:
                              </span>
                              <p className="text-foreground">{userDetails.aadhaarNumber}</p>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    {/* Father's Details */}
                    <Collapsible
                      open={openSections.father}
                      onOpenChange={() => toggleSection("father")}
                    >
                      <Card className="border-l-4 border-l-cyan-500">
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Father's Details</CardTitle>
                            {openSections.father ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Name:</span>
                              <p className="text-foreground">{userDetails.fatherName}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Occupation:
                              </span>
                              <p className="text-foreground">{userDetails.fatherOccupation}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Contact Number:
                              </span>
                              <p className="text-foreground">{userDetails.fatherContact}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Email:</span>
                              <p className="text-foreground">{userDetails.fatherEmail}</p>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    {/* Mother's Details */}
                    <Collapsible
                      open={openSections.mother}
                      onOpenChange={() => toggleSection("mother")}
                    >
                      <Card className="border-l-4 border-l-red-500">
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Mother's Details</CardTitle>
                            {openSections.mother ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Name:</span>
                              <p className="text-foreground">{userDetails.motherName}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Occupation:
                              </span>
                              <p className="text-foreground">{userDetails.motherOccupation}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Contact Number:
                              </span>
                              <p className="text-foreground">{userDetails.motherContact}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Email:</span>
                              <p className="text-foreground">{userDetails.motherEmail}</p>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    {/* Guardian's Details */}
                    <Collapsible
                      open={openSections.guardian}
                      onOpenChange={() => toggleSection("guardian")}
                    >
                      <Card className="border-l-4 border-l-green-500">
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Guardian's Details</CardTitle>
                            {openSections.guardian ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Name:</span>
                              <p className="text-muted-foreground">{userDetails.guardianName}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Occupation:
                              </span>
                              <p className="text-muted-foreground">{userDetails.guardianOccupation}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">
                                Contact Number:
                              </span>
                              <p className="text-muted-foreground">{userDetails.guardianContact}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Email:</span>
                              <p className="text-muted-foreground">{userDetails.guardianEmail}</p>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  </div>
            )}

            {activeView === 'assessments' && (
              <Card>
                <CardHeader>
                  <CardTitle>Assessments Assigned to {selectedUser.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Total Assessments: {assessments.length} | Completed: {assessments.filter(a => a.status === 'Completed').length}
                  </p>
                </CardHeader>
                <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assessment</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Attempts</TableHead>
                          <TableHead>Deadline</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assessments.map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell className="font-medium">{assessment.title}</TableCell>
                            <TableCell>{assessment.courseName}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  assessment.status === "Completed"
                                    ? "default"
                                    : assessment.status === "In Progress"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {assessment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {assessment.score
                                ? `${assessment.score}/${assessment.maxScore}`
                                : `0/${assessment.maxScore}`}
                            </TableCell>
                            <TableCell>{assessment.attempts}</TableCell>
                            <TableCell>{assessment.deadline}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            )}

            {activeView === 'assignments' && (
              <Card>
                <CardHeader>
                  <CardTitle>Assignments Assigned to {selectedUser.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Total Assignments: {assignments.length} | Graded: {assignments.filter(a => a.status === 'Graded').length}
                  </p>
                </CardHeader>
                <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assignment</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            <TableCell>{assignment.courseName}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  assignment.status === "Graded"
                                    ? "default"
                                    : assignment.status === "Submitted"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {assignment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{assignment.dueDate}</TableCell>
                            <TableCell>
                              {assignment.score
                                ? `${assignment.score}/${assignment.maxScore}`
                                : "-"}
                            </TableCell>
                            <TableCell>{assignment.grade || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            )}

            {activeView === 'login' && (
              <Card>
                <CardHeader>
                  <CardTitle>Login History for {selectedUser.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Recent login activities and session information
                  </p>
                </CardHeader>
                <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Device</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loginHistory.map((login) => (
                          <TableRow key={login.id}>
                            <TableCell>{login.timestamp}</TableCell>
                            <TableCell>{login.deviceType}</TableCell>
                            <TableCell>{login.location}</TableCell>
                            <TableCell>{login.ipAddress}</TableCell>
                            <TableCell>
                              <Badge variant="default">{login.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            )}

            {activeView === 'failed' && (
              <Card>
                <CardHeader>
                  <CardTitle>Failed Login Attempts for {selectedUser.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Security log of unsuccessful login attempts
                  </p>
                </CardHeader>
                <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Device</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {failedLogins.map((login) => (
                          <TableRow key={login.id}>
                            <TableCell>{login.timestamp}</TableCell>
                            <TableCell>{login.method}</TableCell>
                            <TableCell>
                              <Badge variant="destructive">{login.reason}</Badge>
                            </TableCell>
                            <TableCell>{login.ipAddress}</TableCell>
                            <TableCell>{login.deviceType}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            )}

            {activeView === 'programs' && (
              <Card>
                <CardHeader>
                  <CardTitle>Programs Enrolled by {selectedUser.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Course enrollments and completion status
                  </p>
                </CardHeader>
                <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Program</TableHead>
                          <TableHead>Enrolled At</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Certificate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell className="font-medium">{enrollment.programName}</TableCell>
                            <TableCell>{enrollment.enrolledAt}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  enrollment.status === "Completed"
                                    ? "default"
                                    : enrollment.status === "Active"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {enrollment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{enrollment.progress}%</TableCell>
                            <TableCell>{enrollment.certificateId || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            )}

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {learningProgress.totalEnrolled}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Total Enrolled</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-success">
                      {learningProgress.totalCompleted}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-accent">
                      {learningProgress.certificatesEarned}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Certificates</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-secondary">
                      {learningProgress.activeEnrollments}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Active</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-3xl font-bold text-destructive">
                      {learningProgress.expiredEnrollments}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Expired</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export & Admin Utility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={() => handleExport("pdf")} variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button onClick={() => handleExport("csv")} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
