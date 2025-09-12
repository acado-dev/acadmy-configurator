import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  FileText, 
  User, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const userAuth = localStorage.getItem("userAuth");
  const user = userAuth ? JSON.parse(userAuth) : null;
  
  // Mock data for demonstration
  const stats = {
    profileCompletion: 65,
    coursesViewed: 12,
    applicationsStarted: 3,
    applicationsSubmitted: 1,
  };
  
  const recentApplications = [
    {
      id: "1",
      courseName: "Artificial Intelligence – AI Now-a-Days",
      universityName: "Metropolia University",
      status: "submitted",
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      courseName: "Business Management",
      universityName: "Oxford University",
      status: "draft",
      lastUpdated: "2024-01-10",
      progress: 45,
    },
  ];
  
  const recommendedCourses = [
    {
      id: "1",
      name: "Data Science Fundamentals",
      university: "MIT",
      match: "95%",
    },
    {
      id: "2",
      name: "Digital Marketing",
      university: "Harvard University",
      match: "88%",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Track your applications and discover new opportunities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.profileCompletion}%</div>
            <Progress value={stats.profileCompletion} className="h-2" />
            <Button 
              variant="link" 
              className="px-0 mt-2"
              onClick={() => navigate("/user/portfolio")}
            >
              Complete Profile →
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Viewed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesViewed}</div>
            <p className="text-xs text-muted-foreground">
              Explore more courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Started</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applicationsStarted}</div>
            <p className="text-xs text-muted-foreground">
              Continue your applications
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applicationsSubmitted}</div>
            <p className="text-xs text-muted-foreground">
              Applications submitted
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Your ongoing and submitted applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{app.courseName}</h4>
                  <p className="text-sm text-muted-foreground">{app.universityName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {app.status === "submitted" ? (
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Submitted
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-yellow-600">
                        <Clock className="h-3 w-3" />
                        Draft ({app.progress}% complete)
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      • {app.lastUpdated}
                    </span>
                  </div>
                  {app.status === "draft" && app.progress && (
                    <Progress value={app.progress} className="h-1 mt-2" />
                  )}
                </div>
                <Button
                  variant={app.status === "submitted" ? "outline" : "default"}
                  size="sm"
                  onClick={() => navigate(`/user/applications/${app.id}`)}
                >
                  {app.status === "submitted" ? "View" : "Continue"}
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/user/applications")}
            >
              View All Applications
            </Button>
          </CardContent>
        </Card>

        {/* Recommended Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>
              Courses that match your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{course.name}</h4>
                  <p className="text-sm text-muted-foreground">{course.university}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-primary mt-2">
                    <TrendingUp className="h-3 w-3" />
                    {course.match} match
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate(`/user/courses/${course.id}`)}
                >
                  View
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/user/courses")}
            >
              Explore All Courses
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/user/courses")}
            >
              <BookOpen className="h-5 w-5" />
              <span>Browse Courses</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/user/portfolio/create")}
            >
              <User className="h-5 w-5" />
              <span>Build Portfolio</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/user/applications")}
            >
              <FileText className="h-5 w-5" />
              <span>My Applications</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={() => navigate("/user/profile")}
            >
              <AlertCircle className="h-5 w-5" />
              <span>Get Help</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;