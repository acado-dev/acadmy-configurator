import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Star, Users, Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Import placeholder for course images
import { coursePlaceholder } from "@/assets/courses/placeholder";

interface Course {
  id: string;
  universityId: string;
  universityName: string;
  universityLogo?: string;
  name: string;
  type: string;
  duration: string;
  description: string;
  enrollments: number;
  rating: number;
  category: string;
  imageUrl?: string;
}

const mockCourses: Course[] = [
  {
    id: "1",
    universityId: "1",
    universityName: "Metropolia University of Applied Sciences",
    name: "Artificial Intelligence – AI Now-a-Days",
    type: "degree",
    duration: "2 years",
    description: "The Future Is Now - Learn cutting-edge AI technologies and applications",
    enrollments: 156,
    rating: 4.5,
    category: "Artificial Intelligence",
    imageUrl: coursePlaceholder
  },
  {
    id: "2",
    universityId: "1",
    universityName: "Metropolia University of Applied Sciences",
    name: "Development And Leadership Of Non-Profit Organizations",
    type: "diploma",
    duration: "1 year",
    description: "Master the skills needed to lead and develop non-profit organizations",
    enrollments: 89,
    rating: 4.5,
    category: "Business Management",
    imageUrl: coursePlaceholder
  },
  {
    id: "3",
    universityId: "2",
    universityName: "Laurea University of Applied Sciences",
    name: "Creativity And Arts In Social And Health Care",
    type: "certification",
    duration: "1-1.5 Years",
    description: "Integrate creative arts into social and healthcare practices",
    enrollments: 234,
    rating: 4.5,
    category: "Healthcare",
    imageUrl: coursePlaceholder
  },
  {
    id: "4",
    universityId: "1",
    universityName: "Metropolia University of Applied Sciences",
    name: "Construction And Real Estate Management",
    type: "degree",
    duration: "2 Years",
    description: "Learn modern construction techniques and real estate management",
    enrollments: 178,
    rating: 4.5,
    category: "construction",
    imageUrl: coursePlaceholder
  },
  {
    id: "5",
    universityId: "1",
    universityName: "Metropolia University of Applied Sciences",
    name: "Health Care Diagnostics, Master's Degree",
    type: "degree",
    duration: "1.5 Years",
    description: "Advanced healthcare diagnostics and medical technology",
    enrollments: 102,
    rating: 4.5,
    category: "Healthcare",
    imageUrl: coursePlaceholder
  },
  {
    id: "6",
    universityId: "1",
    universityName: "Metropolia University of Applied Sciences",
    name: "Top-Up Degree In Business Informatics",
    type: "degree",
    duration: "1 year",
    description: "Bridge the gap between business and IT",
    enrollments: 267,
    rating: 4.5,
    category: "Business Intelligence",
    imageUrl: coursePlaceholder
  },
];

const categories = [
  "Artificial Intelligence",
  "Automation & Robotics",
  "Block Chain",
  "Business Intelligence",
  "Business Management",
  "construction",
  "Cyber Security",
  "Digital Marketing",
  "Engineering",
  "Healthcare",
  "Hospitality",
  "Law",
  "Nursing",
  "Social Services",
  "Tourism"
];

const universities = [
  "Laurea University of Applied Sciences",
  "Metropolia University of Applied Sciences",
  "Satakunta University of Applied Sciences",
  "Xamk University of Applied Sciences"
];

const CourseListing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(course.category);
    const matchesUniversity = selectedUniversities.length === 0 || selectedUniversities.includes(course.universityName);
    
    return matchesSearch && matchesCategory && matchesUniversity;
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleUniversityToggle = (university: string) => {
    setSelectedUniversities(prev =>
      prev.includes(university)
        ? prev.filter(u => u !== university)
        : [...prev, university]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedUniversities([]);
    setSearchQuery("");
  };

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="mb-4"
        >
          Clear Filters
        </Button>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-3">Universities</h3>
            <div className="space-y-2">
              {universities.map(university => (
                <div key={university} className="flex items-center space-x-2">
                  <Checkbox
                    id={university}
                    checked={selectedUniversities.includes(university)}
                    onCheckedChange={() => handleUniversityToggle(university)}
                  />
                  <label
                    htmlFor={university}
                    className="text-sm cursor-pointer hover:text-primary"
                  >
                    {university}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-3">Categories</h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm cursor-pointer hover:text-primary"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Course Discovery Tool</h1>
          <p className="text-lg opacity-90">Find your perfect study abroad program</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="lg:hidden">
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSection />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Filters</h2>
              </CardHeader>
              <CardContent>
                <FilterSection />
              </CardContent>
            </Card>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {filteredCourses.length} courses
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map(course => (
                <Card 
                  key={course.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/user/courses/${course.id}`)}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    <img 
                      src={course.imageUrl} 
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-background/90">
                        {course.universityName.split(" ")[0]}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {course.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.universityName}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrollments} Enrollments</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>Rating {course.rating}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Badge variant="outline">{course.category}</Badge>
                      <Badge variant="outline">{course.duration}</Badge>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/courses/${course.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListing;