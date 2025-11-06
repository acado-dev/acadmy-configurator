import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Building2, MapPin, Users, GraduationCap, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { UniversityDetails, InstitutionType } from '@/types/university';

const Universities = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState<UniversityDetails[]>([]);
  const [deleteUniversityId, setDeleteUniversityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<InstitutionType | 'all'>('all');

  useEffect(() => {
    const savedUniversities = localStorage.getItem('acado_universities');
    if (savedUniversities) {
      setUniversities(JSON.parse(savedUniversities));
      return;
    }

    // Seed sample universities for reference
    const seedUniversities: UniversityDetails[] = [
      {
        id: 'u-jamk',
        name: 'Jamk University of Applied Sciences',
        institutionType: 'University',
        tagline: 'Openness, Innovation, Responsibility, Collaboration',
        foundedYear: 1994,
        logo: '',
        coverImage: '',
        brochureUrl: '',
        website: 'https://www.jamk.fi',
        location: {
          city: 'Jyväskylä',
          state: 'Central Finland',
          country: 'Finland',
          campuses: [
            { id: 'c1', name: 'Rajakatu Campus', location: 'Jyväskylä', specializations: ['Business', 'Technology', 'Tourism', 'Teacher Education'] },
            { id: 'c2', name: 'Lutakko Campus', location: 'Jyväskylä', specializations: ['Social Services', 'Health Care', 'ICT'] },
          ],
        },
        about: {
          description:
            "JAMK is one of Finland's leading universities of applied sciences with strong industry partnerships and international outlook.",
          mission:
            'Provide future-focused education with practical skills, critical thinking, and global perspectives.',
          values: ['Openness', 'Innovation', 'Responsibility', 'Collaboration'],
          highlights: ['300+ partner institutions', '40,000+ alumni', 'Strong RDI projects'],
        },
        factsAndFigures: {
          totalStudents: 9500,
          internationalStudents: 700,
          staffMembers: 900,
          alumniCount: 40000,
          internationalPartnerships: 300,
          partnerCountries: 50,
          graduateEmployability: 80,
          annualGraduates: 1500,
          researchBudget: 20,
        },
        community: {
          description: 'Vibrant network of students, faculty, industry partners, and alumni.',
          studentCount: 9500,
          facultyCount: 900,
          alumniInCountries: 100,
          activeProjects: 300,
        },
        fieldsOfEducation: [
          { id: 'f1', name: 'Business and Tourism', description: 'International business and hospitality', programs: ['International Business', 'Tourism Management'], degrees: ['Bachelor', 'Master'] },
          { id: 'f2', name: 'Technology and ICT', description: 'Engineering and ICT', programs: ['Automation and Robotics', 'ICT Engineering', 'Cybersecurity'], degrees: ['Bachelor', 'Master'] },
        ],
        socialResponsibility: {
          description: 'Committed to sustainable bioeconomy and digitalisation projects.',
          commitments: ['Sustainability', 'Digitalisation', 'Entrepreneurship'],
          initiatives: ['Business Incubator', 'Green Transition Projects'],
        },
        testimonials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: true,
      },
      {
        id: 'u-oxford',
        name: 'University of Oxford',
        institutionType: 'University',
        tagline: 'Dominus Illuminatio Mea',
        foundedYear: 1096,
        logo: '',
        coverImage: '',
        brochureUrl: '',
        website: 'https://www.ox.ac.uk',
        location: {
          city: 'Oxford',
          country: 'United Kingdom',
          campuses: [],
        },
        about: {
          description: 'World-renowned research university with a history of academic excellence.',
          mission: 'Achieve excellence in research and education for the benefit of society.',
          values: ['Excellence', 'Integrity', 'Diversity'],
          highlights: ['Oldest in the English-speaking world', 'Global ranking top 1-5'],
        },
        factsAndFigures: {
          totalStudents: 26000,
          internationalStudents: 11000,
          staffMembers: 13000,
          alumniCount: 300000,
          internationalPartnerships: 500,
          partnerCountries: 100,
          graduateEmployability: 92,
          annualGraduates: 7000,
        },
        community: {
          description: 'A diverse and inclusive global community.',
          studentCount: 26000,
          facultyCount: 13000,
          alumniInCountries: 150,
          activeProjects: 1000,
        },
        fieldsOfEducation: [
          { id: 'f1', name: 'Humanities', programs: ['History', 'Philosophy'], degrees: ['Bachelor', 'Master', 'PhD'] },
          { id: 'f2', name: 'Sciences', programs: ['Physics', 'Chemistry', 'Biology'], degrees: ['Bachelor', 'Master', 'PhD'] },
        ],
        socialResponsibility: {
          description: 'Global impact through research and innovation.',
          commitments: ['Sustainability', 'Health', 'Education'],
          initiatives: ['Oxford Martin School', 'Vaccines research'],
        },
        testimonials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: true,
      },
      {
        id: 'u-mit',
        name: 'Massachusetts Institute of Technology (MIT)',
        institutionType: 'University',
        tagline: 'Mens et Manus',
        foundedYear: 1861,
        logo: '',
        coverImage: '',
        brochureUrl: '',
        website: 'https://www.mit.edu',
        location: {
          city: 'Cambridge',
          state: 'Massachusetts',
          country: 'USA',
          campuses: [],
        },
        about: {
          description: 'Leading institute for technology and innovation.',
          mission: 'Advance knowledge and educate students in science and technology.',
          values: ['Innovation', 'Excellence', 'Collaboration'],
          highlights: ['Cutting-edge research', 'Entrepreneurial ecosystem'],
        },
        factsAndFigures: {
          totalStudents: 11500,
          internationalStudents: 3400,
          staffMembers: 13000,
          alumniCount: 140000,
          internationalPartnerships: 200,
          partnerCountries: 60,
          graduateEmployability: 95,
          annualGraduates: 3000,
        },
        community: {
          description: 'Innovative and entrepreneurial community.',
          studentCount: 11500,
          facultyCount: 13000,
          alumniInCountries: 120,
          activeProjects: 800,
        },
        fieldsOfEducation: [
          { id: 'f1', name: 'Engineering', programs: ['Mechanical', 'Electrical', 'Computer Science'], degrees: ['Bachelor', 'Master', 'PhD'] },
          { id: 'f2', name: 'Business', programs: ['MBA', 'Finance'], degrees: ['Master'] },
        ],
        socialResponsibility: {
          description: 'Solving global challenges through technology.',
          commitments: ['Climate action', 'Health', 'AI for good'],
          initiatives: ['Climate Grand Challenges', 'Jameel Clinic'],
        },
        testimonials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: true,
      },
    ];

    localStorage.setItem('acado_universities', JSON.stringify(seedUniversities));
    setUniversities(seedUniversities);
  }, []);

  const handleDelete = () => {
    if (deleteUniversityId) {
      const updatedUniversities = universities.filter(u => u.id !== deleteUniversityId);
      setUniversities(updatedUniversities);
      localStorage.setItem('acado_universities', JSON.stringify(updatedUniversities));
      setDeleteUniversityId(null);
    }
  };

  // Filter universities by type and search
  const filteredUniversities = universities.filter(university => {
    const matchesSearch = university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          university.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          university.location.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || university.institutionType === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: InstitutionType) => {
    switch (type) {
      case 'University':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'COE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Industry':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'School':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Organizations</h1>
            <p className="text-muted-foreground mt-1">Manage institutions and their profiles</p>
          </div>
          <Button variant="gradient" className="gap-2" onClick={() => navigate('/universities/add')}>
            <Plus className="w-4 h-4" />
            Add Organization
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search institutions..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </Card>
          
          <Card className="p-4">
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="University">University</SelectItem>
                <SelectItem value="COE">COE (Center of Excellence)</SelectItem>
                <SelectItem value="Industry">Industry</SelectItem>
                <SelectItem value="School">School</SelectItem>
              </SelectContent>
            </Select>
          </Card>
        </div>

        {filteredUniversities.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {universities.length === 0 ? 'No institutions added yet' : 'No institutions match your filters'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {universities.length === 0 ? 'Start by adding your first institution' : 'Try adjusting your search or filter criteria'}
            </p>
            {universities.length === 0 && (
              <Button variant="outline" onClick={() => navigate('/universities/add')}>
                Add Your First Institution
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((university) => (
              <Card key={university.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 
                      className="font-semibold text-lg flex-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/universities/${university.id}/view`)}
                    >
                      {university.name}
                    </h3>
                    <Badge className={getTypeColor(university.institutionType)}>
                      {university.institutionType}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{university.location.city}, {university.location.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{university.factsAndFigures.totalStudents.toLocaleString()} students</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/universities/edit/${university.id}`)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setDeleteUniversityId(university.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => navigate(`/universities/${university.id}/details`)}
                    >
                      <Eye className="w-3 h-3" />
                      Manage Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteUniversityId} onOpenChange={() => setDeleteUniversityId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the university.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Universities;