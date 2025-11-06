import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Edit, Mail, MapPin, Phone, Globe, Users, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UniversityDetails, InstitutionType } from '@/types/university';

const UniversityView = () => {
  const navigate = useNavigate();
  const { universityId } = useParams();
  const [university, setUniversity] = useState<UniversityDetails | null>(null);

  useEffect(() => {
    const savedUniversities = localStorage.getItem('acado_universities');
    if (savedUniversities) {
      const universities = JSON.parse(savedUniversities);
      const found = universities.find((u: UniversityDetails) => u.id === universityId);
      if (found) {
        setUniversity(found);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/universities')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{university.name}</h1>
              <Badge className={getTypeColor(university.institutionType)}>
                {university.institutionType}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Organization Profile</p>
          </div>
        </div>
        <div className="flex gap-2">
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
      <Card className="relative overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <Building2 className="w-16 h-16 text-primary/30" />
        </div>
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 bg-background rounded-lg shadow-lg border flex items-center justify-center -mt-16">
              <Building2 className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="flex-1 mt-2">
              <h2 className="text-2xl font-bold">{university.name}</h2>
              {university.shortName && (
                <p className="text-muted-foreground">({university.shortName})</p>
              )}
              {university.tagline && (
                <p className="text-sm text-muted-foreground mt-1 italic">{university.tagline}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {university.organizationLevel && (
              <div>
                <p className="text-sm text-muted-foreground">Organization Level</p>
                <p className="font-medium capitalize">{university.organizationLevel}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Institution Type</p>
              <Badge className={getTypeColor(university.institutionType)}>
                {university.institutionType}
              </Badge>
            </div>
            {university.foundedYear && (
              <div>
                <p className="text-sm text-muted-foreground">Founded</p>
                <p className="font-medium">{university.foundedYear}</p>
              </div>
            )}
            {university.rating && (
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="font-medium">{university.rating}</p>
              </div>
            )}
            {university.rank && (
              <div>
                <p className="text-sm text-muted-foreground">Rank</p>
                <p className="font-medium">{university.rank}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {university.primaryEmail && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{university.primaryEmail}</span>
              </div>
            )}
            {university.mobileNo && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{university.mobileNo}</span>
              </div>
            )}
            {university.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {university.website}
                </a>
              </div>
            )}
            {university.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>{university.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {[university.location.city, university.location.state, university.location.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      {university.about?.description && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{university.about.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Why This University */}
      {university.whyThisUniversity && (
        <Card>
          <CardHeader>
            <CardTitle>Why This University</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{university.whyThisUniversity}</p>
          </CardContent>
        </Card>
      )}

      {/* Admission Information */}
      {university.admission && (
        <Card>
          <CardHeader>
            <CardTitle>Admission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{university.admission}</p>
          </CardContent>
        </Card>
      )}

      {/* Placements */}
      {university.placements && (
        <Card>
          <CardHeader>
            <CardTitle>Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{university.placements}</p>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {university.factsAndFigures && (
        <Card>
          <CardHeader>
            <CardTitle>Facts & Figures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {university.factsAndFigures.totalStudents > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{university.factsAndFigures.totalStudents.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              )}
              {university.factsAndFigures.internationalStudents > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{university.factsAndFigures.internationalStudents.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">International Students</p>
                </div>
              )}
              {university.factsAndFigures.staffMembers > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{university.factsAndFigures.staffMembers.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Staff Members</p>
                </div>
              )}
              {university.factsAndFigures.alumniCount > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{university.factsAndFigures.alumniCount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Alumni</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ */}
      {university.faq && (
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{university.faq}</p>
          </CardContent>
        </Card>
      )}

      {/* Testimonials */}
      {university.testimonials && university.testimonials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {university.testimonials.map((testimonial, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                  <p className="italic">{testimonial}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UniversityView;
