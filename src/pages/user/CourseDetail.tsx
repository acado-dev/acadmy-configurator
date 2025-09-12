import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Users, 
  Clock, 
  MapPin, 
  GraduationCap, 
  Calendar,
  CheckCircle,
  Award,
  BookOpen,
  Globe
} from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Mock course data - in real app, fetch based on courseId
  const course = {
    id: courseId,
    name: "Artificial Intelligence – AI Now-a-Days",
    universityName: "Metropolia University of Applied Sciences",
    universityCountry: "Finland",
    type: "Master's Degree",
    duration: "2 years",
    startDate: "September 2024",
    applicationDeadline: "March 31, 2024",
    description: "This cutting-edge program explores the latest developments in AI, machine learning, and deep learning. Students will gain hands-on experience with real-world AI applications and learn to develop intelligent systems.",
    enrollments: 156,
    rating: 4.5,
    reviews: 42,
    tuitionFee: "€15,000/year",
    language: "English",
    credits: "120 ECTS",
    category: "Artificial Intelligence",
    imageUrl: "/api/placeholder/800/400",
    requirements: [
      "Bachelor's degree in Computer Science, Engineering, or related field",
      "English proficiency (IELTS 6.5 or equivalent)",
      "Basic programming knowledge",
      "Mathematics background (linear algebra, statistics)"
    ],
    curriculum: [
      "Machine Learning Fundamentals",
      "Deep Learning and Neural Networks",
      "Natural Language Processing",
      "Computer Vision",
      "AI Ethics and Governance",
      "Reinforcement Learning",
      "AI in Business Applications",
      "Research Project"
    ],
    outcomes: [
      "Design and implement AI solutions",
      "Apply machine learning algorithms to real-world problems",
      "Develop ethical AI systems",
      "Lead AI projects in organizations",
      "Conduct AI research"
    ],
    applicationFormId: "form-1" // Link to application form
  };

  const handleApplyNow = () => {
    // Check if user is logged in
    const userAuth = localStorage.getItem("userAuth");
    if (!userAuth) {
      navigate("/user/login");
      return;
    }
    
    // Navigate to application form wizard
    navigate(`/user/apply/${course.applicationFormId}`, {
      state: { 
        courseId: course.id,
        courseName: course.name,
        universityName: course.universityName
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
        <img 
          src={course.imageUrl} 
          alt={course.name}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Badge className="mb-3">{course.category}</Badge>
            <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-5 w-5" />
                {course.universityName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                {course.universityCountry}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </CardContent>
            </Card>

            <Tabs defaultValue="requirements" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="requirements">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Admission Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="curriculum">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Course Curriculum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {course.curriculum.map((module, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground text-sm">{module}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="outcomes">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Learning Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {course.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Award className="h-5 w-5 text-primary mt-0.5" />
                          <span className="text-muted-foreground">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </span>
                  <span className="font-medium">{course.startDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Language
                  </span>
                  <span className="font-medium">{course.language}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Credits
                  </span>
                  <span className="font-medium">{course.credits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tuition Fee</span>
                  <span className="font-medium text-primary">{course.tuitionFee}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {course.enrollments} Students Enrolled
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(course.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({course.reviews} reviews)
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Apply Card */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Ready to Apply?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Application Deadline: 
                  <span className="block font-medium text-foreground">
                    {course.applicationDeadline}
                  </span>
                </div>
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleApplyNow}
                >
                  Apply Now
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/user/courses")}
                >
                  Back to Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;