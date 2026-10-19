import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { UniversityDetails as UniversityDetailsType } from '@/types/university';
import { emptyUniversityProfile, updateUniversityProfiles } from '@/lib/universityProfile';

interface UniversityDetailsProps {
  profileId?: string;
  universityAdmin?: boolean;
  initialName?: string;
}

const UniversityDetails = ({ profileId, universityAdmin = false, initialName = '' }: UniversityDetailsProps) => {
  const navigate = useNavigate();
  const { universityId: routeUniversityId } = useParams();
  const universityId = universityAdmin ? profileId : routeUniversityId;
  const [loadComplete, setLoadComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [university, setUniversity] = useState<UniversityDetailsType | null>(null);
  const [formData, setFormData] = useState({
    shortName: '',
    fullName: '',
    rating: '',
    rank: '',
    brochureUrl: '',
    coverImage: '',
    about: '',
    whyThisUniversity: '',
    admission: '',
    placements: '',
    faq: '',
    testimonial: ''
  });

  useEffect(() => {
    try {
      const universities: UniversityDetailsType[] = JSON.parse(localStorage.getItem('acado_universities') || '[]');
      const found = universities.find(u => u.id === universityId)
        || (universityAdmin && universityId ? emptyUniversityProfile(universityId, initialName) : null);
      if (found) {
        setUniversity(found);
        setFormData({
          shortName: found.shortName || '', fullName: found.name || '',
          rating: found.rating || '', rank: found.rank || '',
          brochureUrl: found.brochureUrl || '', coverImage: found.coverImage || '',
          about: found.about?.description || '', whyThisUniversity: found.whyThisUniversity || '',
          admission: found.admission || '', placements: found.placements || '',
          faq: found.faq || '', testimonial: found.testimonials?.[0] || ''
        });
      }
    } catch {
      toast({ title: 'Unable to load university details', variant: 'destructive' });
    } finally {
      setLoadComplete(true);
    }
  }, [universityId, universityAdmin, initialName]);

  const handleSave = () => {
    if (!university || !universityId) return;
    if (!formData.fullName.trim()) {
      toast({ title: 'Enter the university full name', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const universities: UniversityDetailsType[] = JSON.parse(localStorage.getItem('acado_universities') || '[]');
      const current = universities.find(u => u.id === universityId) || university;
      const updated: UniversityDetailsType = {
        ...current, shortName: formData.shortName, name: formData.fullName.trim(),
        rating: formData.rating, rank: formData.rank,
        brochureUrl: formData.brochureUrl, coverImage: formData.coverImage,
        about: { ...current.about, description: formData.about },
        whyThisUniversity: formData.whyThisUniversity, admission: formData.admission,
        placements: formData.placements, faq: formData.faq,
        testimonials: formData.testimonial
          ? [formData.testimonial, ...(current.testimonials || []).slice(1)]
          : (current.testimonials || []).slice(1),
        updatedAt: new Date()
      };
      localStorage.setItem('acado_universities', JSON.stringify(updateUniversityProfiles(universities, updated)));
      setUniversity(updated);
      toast({ title: 'Success', description: 'University details updated successfully' });
      if (!universityAdmin) navigate('/universities');
    } catch {
      toast({ title: 'Unable to save university details', description: 'Please check available browser storage and try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'brochureUrl' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = reader.result;
      if (typeof value === 'string') setFormData(prev => ({ ...prev, [type]: value }));
    };
    reader.onerror = () => toast({ title: 'Unable to read file', variant: 'destructive' });
    reader.readAsDataURL(file);
  };

  if (!university) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">{loadComplete ? 'University details are unavailable. Please contact your platform administrator to link your account to a university.' : 'Loading university details...'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          {!universityAdmin && <Button variant="ghost" size="icon" aria-label="Back to universities" onClick={() => navigate('/universities')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>}
          <div>
            <h1 className="text-3xl font-bold">{universityAdmin ? 'University Details' : `University: ${university.name}`}</h1>
            <p className="text-muted-foreground mt-1">Edit detailed information</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="gradient" className="gap-2">
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
                onChange={(e) => handleFileChange(e, 'brochureUrl')}
                className="cursor-pointer"
              />

            </div>
            <Label htmlFor="brochureUrl">Brochure URL</Label>
            <Input id="brochureUrl" type="url" value={formData.brochureUrl.startsWith('data:') ? '' : formData.brochureUrl} onChange={e => setFormData({ ...formData, brochureUrl: e.target.value })} />
            {formData.brochureUrl && <div className="flex items-center gap-3 mt-2"><a className="text-primary underline" href={formData.brochureUrl} target="_blank" rel="noreferrer">View brochure</a><Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, brochureUrl: '' })}>Remove</Button></div>}
          </div>

          <div>
            <Label htmlFor="banners">Banner Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="banners"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'coverImage')}
                className="cursor-pointer"
              />

            </div>
            <Label htmlFor="bannerUrl">Banner URL</Label>
            <Input id="bannerUrl" type="url" value={formData.coverImage.startsWith('data:') ? '' : formData.coverImage} onChange={e => setFormData({ ...formData, coverImage: e.target.value })} />
            {formData.coverImage && <div className="mt-2 space-y-2"><img src={formData.coverImage} alt="University banner" className="max-h-48 w-full object-contain border rounded-lg" /><Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, coverImage: '' })}>Remove</Button></div>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            aria-label="About"
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
            aria-label="Why This University"
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
            aria-label="Admission"
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
            aria-label="Placements"
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
            aria-label="FAQ"
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
            aria-label="Testimonial"
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
