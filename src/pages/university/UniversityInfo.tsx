import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Camera, Globe, Mail, MapPin, Phone, Save, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UniversityInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [universityData, setUniversityData] = useState({
    name: 'Stanford University',
    shortName: 'Stanford',
    logo: '',
    coverImage: '',
    description: 'Stanford University is a private research university in Stanford, California. Founded in 1885 by Leland and Jane Stanford in memory of their only child, it is one of the most prestigious universities in the world.',
    founded: '1885',
    type: 'Private Research University',
    motto: 'Die Luft der Freiheit weht',
    website: 'https://www.stanford.edu',
    email: 'info@stanford.edu',
    phone: '+1 650-723-2300',
    address: {
      street: '450 Serra Mall',
      city: 'Stanford',
      state: 'California',
      country: 'United States',
      zipCode: '94305'
    },
    socialMedia: {
      facebook: 'https://facebook.com/stanford',
      twitter: 'https://twitter.com/stanford',
      linkedin: 'https://linkedin.com/school/stanford-university',
      instagram: 'https://instagram.com/stanford'
    },
    accreditations: [
      'WASC Senior College and University Commission',
      'AACSB International',
      'ABET'
    ],
    statistics: {
      students: '17,246',
      faculty: '2,279',
      staff: '15,750',
      alumni: '250,000+',
      campusSize: '8,180 acres'
    }
  });

  const handleSave = () => {
    toast({
      title: "University Information Updated",
      description: "Your university profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleImageUpload = (type: 'logo' | 'cover') => {
    toast({
      title: "Image Upload",
      description: `${type === 'logo' ? 'Logo' : 'Cover image'} upload functionality would be implemented here.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">University Information</h1>
          <p className="text-muted-foreground mt-1">Manage your university profile and settings</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Cover Image Section */}
      <Card className="relative overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 relative">
          {universityData.coverImage && (
            <img
              src={universityData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          {isEditing && (
            <Button
              onClick={() => handleImageUpload('cover')}
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4"
            >
              <Camera className="mr-2 h-4 w-4" />
              Change Cover
            </Button>
          )}
        </div>
        <div className="absolute bottom-0 left-6 translate-y-1/2">
          <div className="relative">
            <div className="h-24 w-24 bg-white rounded-lg shadow-lg border-4 border-background flex items-center justify-center">
              {universityData.logo ? (
                <img
                  src={universityData.logo}
                  alt="Logo"
                  className="h-20 w-20 object-contain"
                />
              ) : (
                <Building2 className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            {isEditing && (
              <Button
                onClick={() => handleImageUpload('logo')}
                variant="secondary"
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="mt-16">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Core details about your university</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>University Name</Label>
              <Input
                value={universityData.name}
                onChange={(e) => setUniversityData({...universityData, name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label>Short Name</Label>
              <Input
                value={universityData.shortName}
                onChange={(e) => setUniversityData({...universityData, shortName: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label>Founded</Label>
              <Input
                value={universityData.founded}
                onChange={(e) => setUniversityData({...universityData, founded: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={universityData.type}
                onValueChange={(value) => setUniversityData({...universityData, type: value})}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Private Research University">Private Research University</SelectItem>
                  <SelectItem value="Public Research University">Public Research University</SelectItem>
                  <SelectItem value="Liberal Arts College">Liberal Arts College</SelectItem>
                  <SelectItem value="Community College">Community College</SelectItem>
                  <SelectItem value="Technical Institute">Technical Institute</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Motto</Label>
              <Input
                value={universityData.motto}
                onChange={(e) => setUniversityData({...universityData, motto: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={universityData.description}
                onChange={(e) => setUniversityData({...universityData, description: e.target.value})}
                disabled={!isEditing}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How to reach your university</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={universityData.website}
                  onChange={(e) => setUniversityData({...universityData, website: e.target.value})}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={universityData.email}
                  onChange={(e) => setUniversityData({...universityData, email: e.target.value})}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={universityData.phone}
                  onChange={(e) => setUniversityData({...universityData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Country</Label>
              <Input
                value={universityData.address.country}
                onChange={(e) => setUniversityData({
                  ...universityData,
                  address: {...universityData.address, country: e.target.value}
                })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Street"
                value={universityData.address.street}
                onChange={(e) => setUniversityData({
                  ...universityData,
                  address: {...universityData.address, street: e.target.value}
                })}
                disabled={!isEditing}
              />
              <Input
                placeholder="City"
                value={universityData.address.city}
                onChange={(e) => setUniversityData({
                  ...universityData,
                  address: {...universityData.address, city: e.target.value}
                })}
                disabled={!isEditing}
              />
              <Input
                placeholder="State/Province"
                value={universityData.address.state}
                onChange={(e) => setUniversityData({
                  ...universityData,
                  address: {...universityData.address, state: e.target.value}
                })}
                disabled={!isEditing}
              />
              <Input
                placeholder="ZIP/Postal Code"
                value={universityData.address.zipCode}
                onChange={(e) => setUniversityData({
                  ...universityData,
                  address: {...universityData.address, zipCode: e.target.value}
                })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>University Statistics</CardTitle>
          <CardDescription>Key numbers about your institution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(universityData.statistics).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-2xl font-bold text-primary">{value}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accreditations */}
      <Card>
        <CardHeader>
          <CardTitle>Accreditations</CardTitle>
          <CardDescription>Official accreditations and certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {universityData.accreditations.map((accreditation, index) => (
              <Badge key={index} variant="secondary" className="py-1 px-3">
                {accreditation}
              </Badge>
            ))}
            {isEditing && (
              <Button variant="outline" size="sm">
                + Add Accreditation
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversityInfo;