import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InstitutionType, UniversityDetails } from '@/types/university';
import { toast } from '@/hooks/use-toast';

const AddUniversity = () => {
  const navigate = useNavigate();
  const { universityId } = useParams();
  const isEditMode = !!universityId;
  const [universities, setUniversities] = useState<UniversityDetails[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    mobileNo: '',
    primaryEmail: '',
    organizationLevel: '',
    institutionType: '' as InstitutionType | '',
    description: '',
    address: '',
    country: '',
    state: '',
    city: '',
    parentInstitutionId: '',
    logo: null as File | null,
    templateImage: null as File | null,
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('acado_universities');
    if (saved) {
      const parsedUniversities = JSON.parse(saved);
      setUniversities(parsedUniversities);
      
      // Load existing data in edit mode
      if (isEditMode) {
        const existingUniversity = parsedUniversities.find((u: UniversityDetails) => u.id === universityId);
        if (existingUniversity) {
          setFormData({
            name: existingUniversity.name || '',
            shortName: existingUniversity.shortName || '',
            mobileNo: existingUniversity.mobileNo || '',
            primaryEmail: existingUniversity.primaryEmail || '',
            organizationLevel: existingUniversity.organizationLevel || '',
            institutionType: existingUniversity.institutionType || '',
            description: existingUniversity.about?.description || '',
            address: existingUniversity.address || '',
            country: existingUniversity.location?.country || '',
            state: existingUniversity.location?.state || '',
            city: existingUniversity.location?.city || '',
            parentInstitutionId: existingUniversity.parentInstitutionId || '',
            logo: null,
            templateImage: null,
          });
        }
      }
    }
  }, [isEditMode, universityId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'logo' | 'templateImage', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.primaryEmail || !formData.institutionType) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (Name, Primary Email, Institution Type)',
        variant: 'destructive',
      });
      return;
    }

    if (isEditMode) {
      // Update existing university
      const updatedUniversities = universities.map((u) => {
        if (u.id === universityId) {
          return {
            ...u,
            name: formData.name,
            shortName: formData.shortName,
            institutionType: formData.institutionType as InstitutionType,
            parentInstitutionId: formData.parentInstitutionId || undefined,
            organizationLevel: formData.organizationLevel,
            mobileNo: formData.mobileNo,
            primaryEmail: formData.primaryEmail,
            address: formData.address,
            location: {
              ...u.location,
              city: formData.city,
              state: formData.state,
              country: formData.country,
            },
            about: {
              ...u.about,
              description: formData.description,
            },
            updatedAt: new Date(),
          };
        }
        return u;
      });

      localStorage.setItem('acado_universities', JSON.stringify(updatedUniversities));

      toast({
        title: 'Success',
        description: 'Organization has been updated successfully',
      });
    } else {
      // Create university data
      const newUniversity: UniversityDetails = {
        id: Date.now().toString(),
        name: formData.name,
        shortName: formData.shortName,
        institutionType: formData.institutionType as InstitutionType,
        parentInstitutionId: formData.parentInstitutionId || undefined,
        organizationLevel: formData.organizationLevel,
        mobileNo: formData.mobileNo,
        primaryEmail: formData.primaryEmail,
        address: formData.address,
        foundedYear: new Date().getFullYear(),
        location: {
          city: formData.city,
          state: formData.state,
          country: formData.country,
          campuses: [],
        },
        about: {
          description: formData.description,
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
        testimonials: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: false,
      };

      // Save to localStorage
      const updatedUniversities = [...universities, newUniversity];
      localStorage.setItem('acado_universities', JSON.stringify(updatedUniversities));

      toast({
        title: 'Success',
        description: 'Organization has been created successfully',
      });
    }

    navigate('/universities');
  };

  // Get parent institutions based on type
  const getParentInstitutions = () => {
    if (!formData.institutionType) return [];
    return universities.filter(u => u.institutionType === formData.institutionType);
  };

  return (
    <div className="space-y-6 p-6">
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
            <h1 className="text-3xl font-bold">
              {isEditMode ? 'Edit Organization' : 'Create Organization'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode ? 'Update organization information' : 'Add basic information to create a new institution'}
            </p>
          </div>
        </div>
        <Button className="gap-2" onClick={handleSubmit}>
          <Save className="w-4 h-4" />
          {isEditMode ? 'Update Organization' : 'Save Organization'}
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter organization name."
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="shortName">Short Name</Label>
                  <Input
                    id="shortName"
                    placeholder="Enter organization short name."
                    value={formData.shortName}
                    onChange={(e) => handleInputChange('shortName', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="mobileNo">Mobile No.</Label>
                  <Input
                    id="mobileNo"
                    placeholder="Enter Mobile Number"
                    value={formData.mobileNo}
                    onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="primaryEmail">
                    Primary email / Username <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="primaryEmail"
                    type="email"
                    placeholder="Enter Email."
                    value={formData.primaryEmail}
                    onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="organizationLevel">Organization Level</Label>
                  <Select
                    value={formData.organizationLevel}
                    onValueChange={(value) => handleInputChange('organizationLevel', value)}
                  >
                    <SelectTrigger id="organizationLevel" className="mt-1">
                      <SelectValue placeholder="Internal (Child)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Internal (Child)</SelectItem>
                      <SelectItem value="branch">Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="institutionType">
                    Organization Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.institutionType}
                    onValueChange={(value) => handleInputChange('institutionType', value)}
                  >
                    <SelectTrigger id="institutionType" className="mt-1">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="COE">COE (Center of Excellence)</SelectItem>
                      <SelectItem value="Industry">Industry</SelectItem>
                      <SelectItem value="School">School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 4 - Parent Institution */}
              {formData.institutionType && (
                <div>
                  <Label htmlFor="parentInstitution">Parent Institution</Label>
                  <Select
                    value={formData.parentInstitutionId}
                    onValueChange={(value) => handleInputChange('parentInstitutionId', value)}
                  >
                    <SelectTrigger id="parentInstitution" className="mt-1">
                      <SelectValue placeholder="Select Parent Institution (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Main Institution)</SelectItem>
                      {getParentInstitutions().map((uni) => (
                        <SelectItem key={uni.id} value={uni.id}>
                          {uni.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select if this is a branch or campus of another institution
                  </p>
                </div>
              )}

              {/* Row 5 - Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              {/* Row 6 - Address */}
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Row 7 - Location */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="country">Select Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                  >
                    <SelectTrigger id="country" className="mt-1">
                      <SelectValue placeholder="India" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Finland">Finland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="state">Select state</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleInputChange('state', value)}
                  >
                    <SelectTrigger id="state" className="mt-1">
                      <SelectValue placeholder="Please select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Karnataka">Karnataka</SelectItem>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">Select City</Label>
                  <Input
                    id="city"
                    placeholder="Enter City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Image Uploads */}
            <div className="space-y-6">
              {/* Organization Logo */}
              <div className="space-y-2">
                <Label>
                  Add Organization Logo <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center mb-3">
                    <Building2 className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </div>
                    <input
                      id="logo-upload"
                      type="file"
                      accept=".jpg,.png,.jpeg"
                      className="hidden"
                      onChange={(e) => handleFileChange('logo', e)}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported Format: .jpg, .png, .jpeg
                  </p>
                  {formData.logo && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {formData.logo.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Template Image */}
              <div className="space-y-2">
                <Label>Add Template Image</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/50">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center mb-3">
                    <Building2 className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <label htmlFor="template-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </div>
                    <input
                      id="template-upload"
                      type="file"
                      accept=".jpg,.png,.jpeg"
                      className="hidden"
                      onChange={(e) => handleFileChange('templateImage', e)}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported Format: .jpg, .png, .jpeg
                  </p>
                  {formData.templateImage && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {formData.templateImage.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUniversity;
