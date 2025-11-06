import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { UniversityDetails as UniversityDetailsType } from '@/types/university';

const UniversityDetails = () => {
  const navigate = useNavigate();
  const { universityId } = useParams();
  const [university, setUniversity] = useState<UniversityDetailsType | null>(null);
  const [formData, setFormData] = useState({
    shortName: '',
    fullName: '',
    rating: '',
    rank: '',
    brochure: null as File | null,
    banners: [] as File[],
    about: '',
    whyThisUniversity: '',
    admission: '',
    placements: '',
    faq: '',
    testimonial: ''
  });

  useEffect(() => {
    const savedUniversities = localStorage.getItem('acado_universities');
    if (savedUniversities) {
      const universities = JSON.parse(savedUniversities);
      const found = universities.find((u: UniversityDetailsType) => u.id === universityId);
      if (found) {
        setUniversity(found);
        setFormData({
          shortName: found.shortName || '',
          fullName: found.name || '',
          rating: found.rating || '',
          rank: found.rank || '',
          brochure: null,
          banners: [],
          about: found.about?.description || '',
          whyThisUniversity: found.whyThisUniversity || '',
          admission: found.admission || '',
          placements: found.placements || '',
          faq: found.faq || '',
          testimonial: found.testimonials?.[0] || ''
        });
      }
    }
  }, [universityId]);

  const handleSave = () => {
    const savedUniversities = localStorage.getItem('acado_universities');
    if (savedUniversities && university) {
      const universities = JSON.parse(savedUniversities);
      const updatedUniversities = universities.map((u: UniversityDetailsType) => {
        if (u.id === universityId) {
          return {
            ...u,
            shortName: formData.shortName,
            name: formData.fullName,
            rating: formData.rating,
            rank: formData.rank,
            brochureUrl: formData.brochure ? URL.createObjectURL(formData.brochure) : u.brochureUrl,
            about: {
              ...u.about,
              description: formData.about
            },
            whyThisUniversity: formData.whyThisUniversity,
            admission: formData.admission,
            placements: formData.placements,
            faq: formData.faq,
            testimonials: formData.testimonial ? [formData.testimonial] : u.testimonials || [],
            updatedAt: new Date()
          };
        }
        return u;
      });
      
      localStorage.setItem('acado_universities', JSON.stringify(updatedUniversities));
      toast({
        title: "Success",
        description: "University details updated successfully",
      });
      navigate('/universities');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'brochure' | 'banners') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'brochure') {
      setFormData({ ...formData, brochure: files[0] });
    } else {
      setFormData({ ...formData, banners: Array.from(files) });
    }
  };

  if (!university) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading university details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/universities')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">University: {university.name}</h1>
            <p className="text-muted-foreground mt-1">Edit detailed information</p>
          </div>
        </div>
        <Button onClick={handleSave} variant="gradient" className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="shortName">Short Name</Label>
            <Input
              id="shortName"
              value={formData.shortName}
              onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
              placeholder="Enter short name"
            />
          </div>

          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter full name"
            />
          </div>

          <div>
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              placeholder="Enter rating (e.g., 4.5)"
            />
          </div>

          <div>
            <Label htmlFor="rank">Rank</Label>
            <Input
              id="rank"
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              placeholder="Enter rank"
            />
          </div>

          <div>
            <Label htmlFor="brochure">Brochure</Label>
            <div className="flex items-center gap-2">
              <Input
                id="brochure"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, 'brochure')}
                className="cursor-pointer"
              />
              {formData.brochure && (
                <span className="text-sm text-muted-foreground">{formData.brochure.name}</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="banners">Banners (File Upload)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="banners"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, 'banners')}
                className="cursor-pointer"
              />
              {formData.banners.length > 0 && (
                <span className="text-sm text-muted-foreground">{formData.banners.length} file(s) selected</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            placeholder="Enter information about the university..."
            rows={6}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why This University</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.whyThisUniversity}
            onChange={(e) => setFormData({ ...formData, whyThisUniversity: e.target.value })}
            placeholder="Explain why students should choose this university..."
            rows={6}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admission</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.admission}
            onChange={(e) => setFormData({ ...formData, admission: e.target.value })}
            placeholder="Enter admission requirements and process..."
            rows={6}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Placements</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.placements}
            onChange={(e) => setFormData({ ...formData, placements: e.target.value })}
            placeholder="Enter placement information..."
            rows={6}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.faq}
            onChange={(e) => setFormData({ ...formData, faq: e.target.value })}
            placeholder="Enter frequently asked questions..."
            rows={6}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.testimonial}
            onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
            placeholder="Enter testimonials..."
            rows={6}
            className="resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversityDetails;
