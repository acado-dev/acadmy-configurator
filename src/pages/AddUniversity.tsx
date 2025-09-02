import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { universityFormSections } from '@/data/universityFormSections';
import { UniversityDetails, Campus, EducationField } from '@/types/university';
import { toast } from '@/hooks/use-toast';
import { 
  Building2, MapPin, Info, TrendingUp, Users, GraduationCap, 
  Award, Heart, Clock, FileCheck, HelpCircle 
} from 'lucide-react';

const AddUniversity = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);
  const [formData, setFormData] = useState<Partial<UniversityDetails>>({
    name: '',
    foundedYear: new Date().getFullYear(),
    location: {
      city: '',
      country: '',
      campuses: [],
    },
    about: {
      description: '',
      mission: '',
      values: [],
      highlights: [],
    },
    factsAndFigures: {
      totalStudents: 0,
      internationalStudents: 0,
      staffMembers: 0,
      alumniCount: 0,
      internationalPartnerships: 0,
      partnerCountries: 0,
      graduateEmployability: 0,
      annualGraduates: 0,
    },
    community: {
      description: '',
      studentCount: 0,
      facultyCount: 0,
      alumniInCountries: 0,
      activeProjects: 0,
    },
    fieldsOfEducation: [],
    socialResponsibility: {
      description: '',
      commitments: [],
      initiatives: [],
    },
    isActive: true,
    isVerified: false,
  });

  // Dynamic arrays state
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [educationFields, setEducationFields] = useState<EducationField[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [commitments, setCommitments] = useState<string[]>([]);
  const [initiatives, setInitiatives] = useState<string[]>([]);

  const iconMap: Record<string, React.ComponentType<any>> = {
    Building2,
    MapPin,
    Info,
    TrendingUp,
    Users,
    GraduationCap,
    Award,
    Heart,
    Clock,
    FileCheck,
    HelpCircle,
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleInputChange = (path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // Campus management
  const addCampus = () => {
    const newCampus: Campus = {
      id: Date.now().toString(),
      name: '',
      location: '',
      specializations: [],
    };
    setCampuses([...campuses, newCampus]);
  };

  const updateCampus = (id: string, field: keyof Campus, value: any) => {
    setCampuses(campuses.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const removeCampus = (id: string) => {
    setCampuses(campuses.filter(c => c.id !== id));
  };

  // Education field management
  const addEducationField = () => {
    const newField: EducationField = {
      id: Date.now().toString(),
      name: '',
      programs: [],
      degrees: [],
    };
    setEducationFields([...educationFields, newField]);
  };

  const updateEducationField = (id: string, field: keyof EducationField, value: any) => {
    setEducationFields(educationFields.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const removeEducationField = (id: string) => {
    setEducationFields(educationFields.filter(f => f.id !== id));
  };

  // Array field management
  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const updateArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.location?.city || !formData.location?.country) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Compile all data
    const universityData = {
      ...formData,
      location: {
        ...formData.location!,
        campuses,
      },
      about: {
        ...formData.about!,
        values,
        highlights,
      },
      fieldsOfEducation: educationFields,
      socialResponsibility: {
        ...formData.socialResponsibility!,
        commitments,
        initiatives,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to localStorage (in real app, this would be an API call)
    const universities = JSON.parse(localStorage.getItem('acado_universities') || '[]');
    const newUniversity = {
      ...universityData,
      id: Date.now().toString(),
    };
    universities.push(newUniversity);
    localStorage.setItem('acado_universities', JSON.stringify(universities));

    toast({
      title: 'Success',
      description: 'University has been added successfully',
    });

    navigate('/universities');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/universities')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New University</h1>
            <p className="text-muted-foreground mt-1">
              Complete all sections to create a comprehensive university profile
            </p>
          </div>
        </div>
        <Button variant="gradient" className="gap-2" onClick={handleSubmit}>
          <Save className="w-4 h-4" />
          Save University
        </Button>
      </div>

      {/* Form Sections */}
      <div className="space-y-4">
        {universityFormSections.map((section) => {
          const Icon = iconMap[section.icon] || Building2;
          const isExpanded = expandedSections.includes(section.id);

          return (
            <Card key={section.id} className="overflow-hidden">
              <Collapsible open={isExpanded}>
                <CollapsibleTrigger asChild>
                  <div
                    className="p-6 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-lg">{section.title}</h3>
                          {section.description && (
                            <p className="text-sm text-muted-foreground">{section.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {section.isRequired && (
                          <Badge variant="destructive">Required</Badge>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <Separator />
                  <div className="p-6">
                    {/* Basic Information Section */}
                    {section.id === 'basic' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">University Name *</Label>
                          <Input
                            id="name"
                            placeholder="e.g., Harvard University"
                            value={formData.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tagline">Tagline/Motto</Label>
                          <Input
                            id="tagline"
                            placeholder="e.g., Veritas (Truth)"
                            value={formData.tagline || ''}
                            onChange={(e) => handleInputChange('tagline', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="foundedYear">Year Founded *</Label>
                          <Input
                            id="foundedYear"
                            type="number"
                            placeholder="e.g., 1636"
                            value={formData.foundedYear || ''}
                            onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Official Website *</Label>
                          <Input
                            id="website"
                            type="url"
                            placeholder="https://www.university.edu"
                            value={formData.website || ''}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="logo">University Logo</Label>
                          <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="coverImage">Cover Image</Label>
                          <Input
                            id="coverImage"
                            type="file"
                            accept="image/*"
                            className="mt-1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="brochureUrl">Brochure URL</Label>
                          <Input
                            id="brochureUrl"
                            type="url"
                            placeholder="Link to university brochure"
                            value={formData.brochureUrl || ''}
                            onChange={(e) => handleInputChange('brochureUrl', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {/* Location Section */}
                    {section.id === 'location' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              placeholder="e.g., Cambridge"
                              value={formData.location?.city || ''}
                              onChange={(e) => handleInputChange('location.city', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State/Province</Label>
                            <Input
                              id="state"
                              placeholder="e.g., Massachusetts"
                              value={formData.location?.state || ''}
                              onChange={(e) => handleInputChange('location.state', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="country">Country *</Label>
                            <Select
                              value={formData.location?.country || ''}
                              onValueChange={(value) => handleInputChange('location.country', value)}
                            >
                              <SelectTrigger id="country" className="mt-1">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USA">United States</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="Australia">Australia</SelectItem>
                                <SelectItem value="Germany">Germany</SelectItem>
                                <SelectItem value="France">France</SelectItem>
                                <SelectItem value="Finland">Finland</SelectItem>
                                <SelectItem value="Netherlands">Netherlands</SelectItem>
                                <SelectItem value="Sweden">Sweden</SelectItem>
                                <SelectItem value="Switzerland">Switzerland</SelectItem>
                                <SelectItem value="Singapore">Singapore</SelectItem>
                                <SelectItem value="Japan">Japan</SelectItem>
                                <SelectItem value="South Korea">South Korea</SelectItem>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="China">China</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Campuses */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <Label>Campuses</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addCampus}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Campus
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {campuses.map((campus) => (
                              <Card key={campus.id} className="p-4">
                                <div className="space-y-3">
                                  <div className="flex gap-3">
                                    <Input
                                      placeholder="Campus name"
                                      value={campus.name}
                                      onChange={(e) => updateCampus(campus.id, 'name', e.target.value)}
                                      className="flex-1"
                                    />
                                    <Input
                                      placeholder="Location"
                                      value={campus.location}
                                      onChange={(e) => updateCampus(campus.id, 'location', e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeCampus(campus.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <Input
                                    placeholder="Specializations (comma-separated)"
                                    value={campus.specializations?.join(', ') || ''}
                                    onChange={(e) => updateCampus(campus.id, 'specializations', e.target.value.split(',').map(s => s.trim()))}
                                  />
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* About Section */}
                    {section.id === 'about' && (
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="description">University Description *</Label>
                          <Textarea
                            id="description"
                            placeholder="Provide a comprehensive overview of the university..."
                            value={formData.about?.description || ''}
                            onChange={(e) => handleInputChange('about.description', e.target.value)}
                            className="mt-1"
                            rows={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="mission">Mission Statement *</Label>
                          <Textarea
                            id="mission"
                            placeholder="Our mission is to..."
                            value={formData.about?.mission || ''}
                            onChange={(e) => handleInputChange('about.mission', e.target.value)}
                            className="mt-1"
                            rows={3}
                          />
                        </div>

                        {/* Core Values */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <Label>Core Values</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(setValues)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Value
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {values.map((value, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="e.g., Innovation, Excellence"
                                  value={value}
                                  onChange={(e) => updateArrayItem(setValues, index, e.target.value)}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeArrayItem(setValues, index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Highlights */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <Label>Key Highlights</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(setHighlights)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Highlight
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {highlights.map((highlight, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="Add key highlights and achievements"
                                  value={highlight}
                                  onChange={(e) => updateArrayItem(setHighlights, index, e.target.value)}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeArrayItem(setHighlights, index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Facts & Figures Section */}
                    {section.id === 'facts' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label htmlFor="totalStudents">Total Students *</Label>
                          <Input
                            id="totalStudents"
                            type="number"
                            placeholder="e.g., 25000"
                            value={formData.factsAndFigures?.totalStudents || ''}
                            onChange={(e) => handleInputChange('factsAndFigures.totalStudents', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="internationalStudents">International Students</Label>
                          <Input
                            id="internationalStudents"
                            type="number"
                            placeholder="e.g., 5000"
                            value={formData.factsAndFigures?.internationalStudents || ''}
                            onChange={(e) => handleInputChange('factsAndFigures.internationalStudents', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="staffMembers">Staff Members *</Label>
                          <Input
                            id="staffMembers"
                            type="number"
                            placeholder="e.g., 2500"
                            value={formData.factsAndFigures?.staffMembers || ''}
                            onChange={(e) => handleInputChange('factsAndFigures.staffMembers', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="alumniCount">Alumni Network Size</Label>
                          <Input
                            id="alumniCount"
                            type="number"
                            placeholder="e.g., 100000"
                            value={formData.factsAndFigures?.alumniCount || ''}
                            onChange={(e) => handleInputChange('factsAndFigures.alumniCount', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="internationalPartnerships">International Partnerships</Label>
                          <Input
                            id="internationalPartnerships"
                            type="number"
                            placeholder="e.g., 300"
                            value={formData.factsAndFigures?.internationalPartnerships || ''}
                            onChange={(e) => handleInputChange('factsAndFigures.internationalPartnerships', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="partnerCountries">Partner Countries</Label>
                          <Input
                            id="partnerCountries"
                            type="number"
                            placeholder="e.g., 50"
                            value={formData.factsAndFigures?.partnerCountries || ''}
                            onChange={(e) => handleInputChange('factsAndFigures.partnerCountries', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="graduateEmployability">Graduate Employability (%)</Label>
                          <Input
                            id="graduateEmployability"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="e.g., 85"
                            value={formData.factsAndFigures?.graduateEmployability || ''}
                            onChange={(e) => handleInputChange('factsAndFigures.graduateEmployability', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="annualGraduates">Annual Graduates</Label>
                          <Input
                            id="annualGraduates"
                            type="number"
                            placeholder="e.g., 1500"
                            value={formData.factsAndFigures?.annualGraduates || ''}
                            onChange={(e) => handleInputChange('factsAndFigures.annualGraduates', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="researchBudget">Research Budget (millions)</Label>
                          <Input
                            id="researchBudget"
                            type="number"
                            placeholder="e.g., 20"
                            value={formData.factsAndFigures?.researchBudget || ''}
                            onChange={(e) => handleInputChange('factsAndFigures.researchBudget', parseInt(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {/* Fields of Education Section */}
                    {section.id === 'education' && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <Label>Fields of Education</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addEducationField}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Field
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {educationFields.map((field) => (
                            <Card key={field.id} className="p-4">
                              <div className="space-y-3">
                                <div className="flex gap-3">
                                  <Input
                                    placeholder="Field name (e.g., Business and Tourism)"
                                    value={field.name}
                                    onChange={(e) => updateEducationField(field.id, 'name', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeEducationField(field.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Textarea
                                  placeholder="Description (optional)"
                                  value={field.description || ''}
                                  onChange={(e) => updateEducationField(field.id, 'description', e.target.value)}
                                  rows={2}
                                />
                                <Input
                                  placeholder="Programs (comma-separated, e.g., International Business, Tourism Management)"
                                  value={field.programs?.join(', ') || ''}
                                  onChange={(e) => updateEducationField(field.id, 'programs', e.target.value.split(',').map(s => s.trim()))}
                                />
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social Responsibility Section */}
                    {section.id === 'social' && (
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="socialDescription">Social Responsibility Overview</Label>
                          <Textarea
                            id="socialDescription"
                            placeholder="Describe social responsibility initiatives..."
                            value={formData.socialResponsibility?.description || ''}
                            onChange={(e) => handleInputChange('socialResponsibility.description', e.target.value)}
                            className="mt-1"
                            rows={4}
                          />
                        </div>

                        {/* Commitments */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <Label>Commitments</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(setCommitments)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Commitment
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {commitments.map((commitment, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="Add social responsibility commitment"
                                  value={commitment}
                                  onChange={(e) => updateArrayItem(setCommitments, index, e.target.value)}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeArrayItem(setCommitments, index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Initiatives */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <Label>Initiatives</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addArrayItem(setInitiatives)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Initiative
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {initiatives.map((initiative, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder="Add specific initiative"
                                  value={initiative}
                                  onChange={(e) => updateArrayItem(setInitiatives, index, e.target.value)}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeArrayItem(setInitiatives, index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Community Section */}
                    {section.id === 'community' && (
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="communityDescription">Community Description</Label>
                          <Textarea
                            id="communityDescription"
                            placeholder="Describe the university community..."
                            value={formData.community?.description || ''}
                            onChange={(e) => handleInputChange('community.description', e.target.value)}
                            className="mt-1"
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="activeProjects">Active RDI Projects</Label>
                            <Input
                              id="activeProjects"
                              type="number"
                              placeholder="e.g., 300"
                              value={formData.community?.activeProjects || ''}
                              onChange={(e) => handleInputChange('community.activeProjects', parseInt(e.target.value))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="alumniInCountries">Alumni Present in Countries</Label>
                            <Input
                              id="alumniInCountries"
                              type="number"
                              placeholder="e.g., 100"
                              value={formData.community?.alumniInCountries || ''}
                              onChange={(e) => handleInputChange('community.alumniInCountries', parseInt(e.target.value))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AddUniversity;