import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Edit, Mail, MapPin, Phone, Globe, Users, GraduationCap, FileText, Award, Calendar, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UniversityDetails, InstitutionType } from '@/types/university';

const UniversityView = () => {
  const navigate = useNavigate();
  const { universityId } = useParams();
  const [university, setUniversity] = useState<UniversityDetails | null>(null);
  const [parentInstitution, setParentInstitution] = useState<UniversityDetails | null>(null);

  useEffect(() => {
    const savedUniversities = localStorage.getItem('acado_universities');
    if (savedUniversities) {
      const universities = JSON.parse(savedUniversities);
      const found = universities.find((u: UniversityDetails) => u.id === universityId);
      if (found) {
        setUniversity(found);
        
        // Find parent institution if exists
        if (found.parentInstitutionId) {
          const parent = universities.find((u: UniversityDetails) => u.id === found.parentInstitutionId);
          if (parent) {
            setParentInstitution(parent);
          }
        }
      }
    }
  }, [universityId]);

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

  if (!university) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading organization details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/universities')} className="hover-scale">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold">{university.name}</h1>
              <Badge className={getTypeColor(university.institutionType)}>
                {university.institutionType}
              </Badge>
              {university.isVerified && (
                <Badge variant="outline" className="gap-1">
                  <Award className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">Complete Organization Profile</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/universities/edit/${university.id}`)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Basic Info
          </Button>
          <Button 
            onClick={() => navigate(`/universities/${university.id}/details`)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Manage Details
          </Button>
        </div>
      </div>

      {/* Cover Image & Logo */}
      <Card className="relative overflow-hidden group">
        <div className="h-56 bg-gradient-to-br from-primary via-primary-hover to-primary/80 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTAgMThjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnptMTggMzZjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <Building2 className="w-20 h-20 text-white/40 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="h-28 w-28 bg-background rounded-lg shadow-xl border-4 border-background flex items-center justify-center -mt-20">
              <Building2 className="w-14 h-14 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold">{university.name}</h2>
              {university.shortName && (
                <p className="text-lg text-muted-foreground">({university.shortName})</p>
              )}
              {university.tagline && (
                <p className="text-sm text-muted-foreground mt-2 italic border-l-4 border-primary pl-3">
                  "{university.tagline}"
                </p>
              )}
              {university.foundedYear && (
                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Founded in {university.foundedYear}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content in Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="additional">Additional</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {university.organizationLevel && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Organization Level</p>
                    <p className="font-medium capitalize">{university.organizationLevel}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Institution Type</p>
                  <Badge className={getTypeColor(university.institutionType)}>
                    {university.institutionType}
                  </Badge>
                </div>
                {university.foundedYear && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Founded</p>
                    <p className="font-medium">{university.foundedYear}</p>
                  </div>
                )}
                {university.rating && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <p className="font-medium">{university.rating}</p>
                    </div>
                  </div>
                )}
                {university.rank && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Rank</p>
                    <p className="font-medium">#{university.rank}</p>
                  </div>
                )}
                {parentInstitution && (
                  <div className="space-y-1 md:col-span-3">
                    <p className="text-sm text-muted-foreground">Parent Institution</p>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-primary" />
                      <button
                        onClick={() => navigate(`/universities/${parentInstitution.id}/view`)}
                        className="font-medium text-primary hover:underline"
                      >
                        {parentInstitution.name}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {university.about?.description && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.about.description}</p>
              </CardContent>
            </Card>
          )}

          {university.about?.mission && (
            <Card>
              <CardHeader>
                <CardTitle>Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.about.mission}</p>
              </CardContent>
            </Card>
          )}

          {university.about?.values && university.about.values.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Core Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {university.about.values.map((value, index) => (
                    <Badge key={index} variant="secondary" className="px-4 py-2">
                      {value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {university.primaryEmail && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Primary Email</p>
                      <a href={`mailto:${university.primaryEmail}`} className="font-medium hover:text-primary">
                        {university.primaryEmail}
                      </a>
                    </div>
                  </div>
                )}
                {university.mobileNo && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mobile Number</p>
                      <a href={`tel:${university.mobileNo}`} className="font-medium hover:text-primary">
                        {university.mobileNo}
                      </a>
                    </div>
                  </div>
                )}
                {university.website && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a 
                        href={university.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-medium text-primary hover:underline"
                      >
                        {university.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  {university.address && (
                    <p className="font-medium">{university.address}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {[university.location.city, university.location.state, university.location.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {university.whyThisUniversity && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Why This University
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.whyThisUniversity}</p>
              </CardContent>
            </Card>
          )}

          {university.admission && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Admission Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.admission}</p>
              </CardContent>
            </Card>
          )}

          {university.placements && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Placements & Career
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.placements}</p>
              </CardContent>
            </Card>
          )}

          {university.fieldsOfEducation && university.fieldsOfEducation.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Fields of Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {university.fieldsOfEducation.map((field) => (
                    <div key={field.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-2">{field.name}</h4>
                      {field.description && (
                        <p className="text-sm text-muted-foreground mb-3">{field.description}</p>
                      )}
                      {field.programs && field.programs.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {field.programs.map((program, idx) => (
                            <Badge key={idx} variant="outline">{program}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          {university.factsAndFigures && (
            <Card>
              <CardHeader>
                <CardTitle>Facts & Figures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {university.factsAndFigures.totalStudents > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.totalStudents.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">Total Students</p>
                    </div>
                  )}
                  {university.factsAndFigures.internationalStudents > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <Globe className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.internationalStudents.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">International Students</p>
                    </div>
                  )}
                  {university.factsAndFigures.staffMembers > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.staffMembers.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">Staff Members</p>
                    </div>
                  )}
                  {university.factsAndFigures.alumniCount > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <GraduationCap className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.alumniCount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">Alumni</p>
                    </div>
                  )}
                  {university.factsAndFigures.internationalPartnerships > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <LinkIcon className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.internationalPartnerships.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">Partnerships</p>
                    </div>
                  )}
                  {university.factsAndFigures.graduateEmployability > 0 && (
                    <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                      <Award className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold text-primary">{university.factsAndFigures.graduateEmployability}%</p>
                      <p className="text-sm text-muted-foreground mt-1">Employability</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {university.community && (
            <Card>
              <CardHeader>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                {university.community.description && (
                  <p className="mb-4 leading-relaxed">{university.community.description}</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{university.community.studentCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Students</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{university.community.facultyCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Faculty</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{university.community.alumniInCountries}</p>
                    <p className="text-xs text-muted-foreground mt-1">Countries</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{university.community.activeProjects}</p>
                    <p className="text-xs text-muted-foreground mt-1">Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Additional Tab */}
        <TabsContent value="additional" className="space-y-6">
          {university.faq && (
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{university.faq}</p>
              </CardContent>
            </Card>
          )}

          {university.testimonials && university.testimonials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {university.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-primary bg-muted/30 p-4 rounded-r-lg">
                      <p className="italic leading-relaxed">{testimonial}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {university.socialResponsibility && (
            <Card>
              <CardHeader>
                <CardTitle>Social Responsibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {university.socialResponsibility.description && (
                  <p className="leading-relaxed">{university.socialResponsibility.description}</p>
                )}
                {university.socialResponsibility.commitments && university.socialResponsibility.commitments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Commitments</h4>
                    <div className="flex flex-wrap gap-2">
                      {university.socialResponsibility.commitments.map((commitment, idx) => (
                        <Badge key={idx} variant="secondary">{commitment}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {university.socialResponsibility.initiatives && university.socialResponsibility.initiatives.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Initiatives</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {university.socialResponsibility.initiatives.map((initiative, idx) => (
                        <li key={idx}>{initiative}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {university.about?.highlights && university.about.highlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {university.about.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversityView;
