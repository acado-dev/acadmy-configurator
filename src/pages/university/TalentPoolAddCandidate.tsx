import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, User, GraduationCap, FileText, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TalentPoolAddCandidate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/university') ? '/university/talent-pool' : '/talent-pool';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    passportNumber: '',
    currentLocation: '',
    intendedProgram: '',
    programLevel: '',
    preferredCountries: [] as string[],
    interests: '',
    careerAspirations: '',
    // Academic
    lastDegree: '',
    institution: '',
    percentage: '',
    yearOfCompletion: '',
    stream: '',
    // Exam scores
    examType: '',
    examScore: '',
    examDate: '',
    // Financial
    budget: '',
    currency: 'USD',
    fundingCategory: '',
    // Notes
    notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast({ title: 'Validation Error', description: 'Name and Email are required.', variant: 'destructive' });
      return;
    }
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('talentPoolCandidates') || '[]');
    const newCandidate = {
      id: `cand-${Date.now()}`,
      ...formData,
      preferredCountries: formData.preferredCountries,
      applicationStage: 'Lead',
      eligibilityStatus: 'Eligible',
      isVerified: false,
      isShortlisted: false,
      scholarshipEligible: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    existing.push(newCandidate);
    localStorage.setItem('talentPoolCandidates', JSON.stringify(existing));
    toast({ title: 'Candidate Added', description: `${formData.name} has been added to the talent pool.` });
    navigate(`${basePath}/candidates`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(basePath)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Candidate</h1>
          <p className="text-muted-foreground">Manually register a student profile in the talent pool</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="email@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+1 234-567-8901" />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={formData.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={v => handleChange('gender', v)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nationality</Label>
                <Input value={formData.nationality} onChange={e => handleChange('nationality', e.target.value)} placeholder="e.g., Indian" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Passport Number</Label>
                <Input value={formData.passportNumber} onChange={e => handleChange('passportNumber', e.target.value)} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label>Current Location</Label>
                <Input value={formData.currentLocation} onChange={e => handleChange('currentLocation', e.target.value)} placeholder="City, Country" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-4 w-4" /> Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Last Degree</Label>
                <Input value={formData.lastDegree} onChange={e => handleChange('lastDegree', e.target.value)} placeholder="e.g., Bachelor of Science" />
              </div>
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input value={formData.institution} onChange={e => handleChange('institution', e.target.value)} placeholder="University name" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Percentage/CGPA</Label>
                <Input value={formData.percentage} onChange={e => handleChange('percentage', e.target.value)} placeholder="e.g., 85%" />
              </div>
              <div className="space-y-2">
                <Label>Year of Completion</Label>
                <Input value={formData.yearOfCompletion} onChange={e => handleChange('yearOfCompletion', e.target.value)} placeholder="e.g., 2024" />
              </div>
              <div className="space-y-2">
                <Label>Stream</Label>
                <Input value={formData.stream} onChange={e => handleChange('stream', e.target.value)} placeholder="e.g., Science" />
              </div>
            </div>
            <div className="pt-2 border-t">
              <Label className="text-sm font-semibold">Test Scores</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="space-y-2">
                  <Label>Exam Type</Label>
                  <Select value={formData.examType} onValueChange={v => handleChange('examType', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {['IELTS', 'TOEFL', 'Duolingo', 'SAT', 'GRE', 'GMAT', 'PTE'].map(e => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Score</Label>
                  <Input value={formData.examScore} onChange={e => handleChange('examScore', e.target.value)} placeholder="e.g., 7.5" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={formData.examDate} onChange={e => handleChange('examDate', e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" /> Study Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Intended Program</Label>
                <Input value={formData.intendedProgram} onChange={e => handleChange('intendedProgram', e.target.value)} placeholder="e.g., Computer Science" />
              </div>
              <div className="space-y-2">
                <Label>Program Level</Label>
                <Select value={formData.programLevel} onValueChange={v => handleChange('programLevel', v)}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UG">Undergraduate</SelectItem>
                    <SelectItem value="PG">Postgraduate</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Certification">Certification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Preferred Countries</Label>
              <div className="flex flex-wrap gap-2">
                {['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Ireland'].map(country => (
                  <Badge
                    key={country}
                    variant={formData.preferredCountries.includes(country) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        preferredCountries: prev.preferredCountries.includes(country)
                          ? prev.preferredCountries.filter(c => c !== country)
                          : [...prev.preferredCountries, country]
                      }));
                    }}
                  >
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Career Aspirations</Label>
              <Textarea value={formData.careerAspirations} onChange={e => handleChange('careerAspirations', e.target.value)} placeholder="Brief career goals..." rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Financial & Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" /> Financial & Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budget</Label>
                <Input type="number" value={formData.budget} onChange={e => handleChange('budget', e.target.value)} placeholder="e.g., 50000" />
              </div>
              <div className="space-y-2">
                <Label>Funding Category</Label>
                <Select value={formData.fundingCategory} onValueChange={v => handleChange('fundingCategory', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self-funded">Self-funded</SelectItem>
                    <SelectItem value="Loan Required">Loan Required</SelectItem>
                    <SelectItem value="Scholarship Seeking">Scholarship Seeking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} placeholder="Any internal notes about this candidate..." rows={4} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(basePath)}>Cancel</Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" /> Save Candidate
        </Button>
      </div>
    </div>
  );
};

export default TalentPoolAddCandidate;
