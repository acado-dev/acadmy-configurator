import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  UniversityDetails as UniversityDetailsType,
  InstitutionType,
  KeyStatistic,
  HighlightCard,
  GalleryImage,
  InternationalPartner,
  AdmissionCard,
  UniversityFaq,
  Campus,
} from '@/types/university';
import { emptyUniversityProfile, updateUniversityProfiles } from '@/lib/universityProfile';

interface UniversityDetailsProps {
  profileId?: string;
  universityAdmin?: boolean;
  initialName?: string;
}

const uid = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

const SECTION_DEFS = [
  { key: 'overview', label: 'Facts & Overview' },
  { key: 'highlights', label: 'University Highlights' },
  { key: 'campus', label: 'Campus, Video & Gallery' },
  { key: 'partners', label: 'International Partners' },
  { key: 'admissions', label: 'Admissions & Support' },
];

// Dual media input: direct file upload OR URL, with preview and remove (project media pattern)
const ImageField = ({ label, value, onChange, accept = 'image/*' }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accept?: string;
}) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.onerror = () => toast({ title: 'Unable to read file', variant: 'destructive' });
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input type="file" accept={accept} onChange={handleFile} className="cursor-pointer" />
      </div>
      <Input
        type="url"
        placeholder="...or paste an image URL"
        value={value.startsWith('data:') ? '' : value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <div className="flex items-center gap-3">
          <img src={value} alt={label} className="h-16 w-24 object-cover rounded border" />
          <Button variant="ghost" size="sm" onClick={() => onChange('')}>Remove</Button>
        </div>
      )}
    </div>
  );
};

const MoveButtons = ({ index, total, onMove }: { index: number; total: number; onMove: (from: number, to: number) => void }) => (
  <div className="flex items-center gap-1">
    <Button type="button" variant="ghost" size="icon" aria-label="Move up" disabled={index === 0} onClick={() => onMove(index, index - 1)}>
      <ArrowUp className="w-4 h-4" />
    </Button>
    <Button type="button" variant="ghost" size="icon" aria-label="Move down" disabled={index === total - 1} onClick={() => onMove(index, index + 1)}>
      <ArrowDown className="w-4 h-4" />
    </Button>
  </div>
);

function moveItem<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const UniversityDetails = ({ profileId, universityAdmin = false, initialName = '' }: UniversityDetailsProps) => {
  const navigate = useNavigate();
  const { universityId: routeUniversityId } = useParams();
  const universityId = universityAdmin ? profileId : routeUniversityId;
  const [loadComplete, setLoadComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [university, setUniversity] = useState<UniversityDetailsType | null>(null);

  // Existing flat fields (preserved)
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

  // Section 1: Identity additions
  const [identity, setIdentity] = useState({
    slug: '',
    institutionType: 'University' as InstitutionType,
    city: '',
    country: '',
    logo: '',
    heroImageAlt: '',
    isActive: true,
  });

  // Section 2: Facts & Overview
  const [keyStatistics, setKeyStatistics] = useState<KeyStatistic[]>([]);
  const [atAGlanceFacts, setAtAGlanceFacts] = useState<string[]>([]);
  const [overviewCallout, setOverviewCallout] = useState('');
  const [sectionOrder, setSectionOrder] = useState<string[]>(SECTION_DEFS.map(s => s.key));

  // Section 3: Highlights
  const [highlightCards, setHighlightCards] = useState<HighlightCard[]>([]);

  // Section 4: Campus, Video & Gallery
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [video, setVideo] = useState({ title: '', url: '', poster: '', caption: '' });
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  // Section 5: International Partners
  const [partners, setPartners] = useState<InternationalPartner[]>([]);

  // Section 6: Admissions & Support
  const [admissionCards, setAdmissionCards] = useState<AdmissionCard[]>([]);
  const [applicationRequirements, setApplicationRequirements] = useState('');
  const [admissionContact, setAdmissionContact] = useState({ email: '', phone: '' });
  const [faqs, setFaqs] = useState<UniversityFaq[]>([]);

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
        setIdentity({
          slug: found.slug || '',
          institutionType: found.institutionType || 'University',
          city: found.location?.city || '',
          country: found.location?.country || '',
          logo: found.logo || '',
          heroImageAlt: found.heroImageAlt || '',
          isActive: found.isActive !== false,
        });
        setKeyStatistics(found.keyStatistics || []);
        setAtAGlanceFacts(found.atAGlanceFacts || []);
        setOverviewCallout(found.overviewCallout || '');
        setSectionOrder(
          found.sectionOrder && found.sectionOrder.length > 0
            ? found.sectionOrder
            : SECTION_DEFS.map(s => s.key)
        );
        setHighlightCards(found.highlightCards || []);
        setCampuses(found.location?.campuses || []);
        setVideo({
          title: found.video?.title || '', url: found.video?.url || '',
          poster: found.video?.poster || '', caption: found.video?.caption || '',
        });
        setGallery(found.gallery || []);
        setPartners(found.internationalPartners || []);
        setAdmissionCards(found.admissionCards || []);
        setApplicationRequirements(found.applicationRequirements || '');
        setAdmissionContact({
          email: found.admissionContact?.email || '',
          phone: found.admissionContact?.phone || '',
        });
        setFaqs(found.faqs || []);
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
        ...current,
        // Existing fields (preserved)
        shortName: formData.shortName, name: formData.fullName.trim(),
        rating: formData.rating, rank: formData.rank,
        brochureUrl: formData.brochureUrl, coverImage: formData.coverImage,
        about: { ...current.about, description: formData.about },
        whyThisUniversity: formData.whyThisUniversity, admission: formData.admission,
        placements: formData.placements, faq: formData.faq,
        testimonials: formData.testimonial
          ? [formData.testimonial, ...(current.testimonials || []).slice(1)]
          : (current.testimonials || []).slice(1),
        // Identity
        slug: identity.slug.trim(),
        institutionType: identity.institutionType,
        logo: identity.logo,
        heroImageAlt: identity.heroImageAlt,
        isActive: identity.isActive,
        location: { ...current.location, city: identity.city, country: identity.country, campuses },
        // Facts & Overview
        keyStatistics, atAGlanceFacts: atAGlanceFacts.filter(f => f.trim()), overviewCallout, sectionOrder,
        // Highlights
        highlightCards: highlightCards.map((h, i) => ({ ...h, order: i })),
        // Campus, Video & Gallery
        video, gallery: gallery.map((g, i) => ({ ...g, order: i })),
        // Partners
        internationalPartners: partners,
        // Admissions & Support
        admissionCards, applicationRequirements, admissionContact,
        faqs: faqs.map((f, i) => ({ ...f, order: i })),
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
            <p className="text-muted-foreground mt-1">Configure the content shown on the university detail page</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="gradient" className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 justify-start">
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="facts">Facts & Overview</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
          <TabsTrigger value="campus">Campus & Media</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="admissions">Admissions & Support</TabsTrigger>
          <TabsTrigger value="content">Content Sections</TabsTrigger>
        </TabsList>

        {/* ============ 1. UNIVERSITY IDENTITY ============ */}
        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>University Identity</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">University Name <span className="text-destructive">*</span></Label>
                  <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Enter full name" />
                </div>
                <div>
                  <Label htmlFor="shortName">Short Name</Label>
                  <Input id="shortName" value={formData.shortName} onChange={(e) => setFormData({ ...formData, shortName: e.target.value })} placeholder="Enter short name" />
                </div>
                <div>
                  <Label htmlFor="slug">Internal ID / Slug</Label>
                  <Input id="slug" value={identity.slug} onChange={(e) => setIdentity({ ...identity, slug: e.target.value })} placeholder="e.g. xamk-university-of-applied-sciences" />
                  <p className="text-xs text-muted-foreground mt-1">System ID: {university.id}</p>
                </div>
                <div>
                  <Label htmlFor="institutionType">Institution Type</Label>
                  <Select value={identity.institutionType} onValueChange={(v) => setIdentity({ ...identity, institutionType: v as InstitutionType })}>
                    <SelectTrigger id="institutionType"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="COE">COE (Center of Excellence)</SelectItem>
                      <SelectItem value="Industry">Industry</SelectItem>
                      <SelectItem value="School">School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">Primary City</Label>
                  <Input id="city" value={identity.city} onChange={(e) => setIdentity({ ...identity, city: e.target.value })} placeholder="Enter city" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={identity.country} onChange={(e) => setIdentity({ ...identity, country: e.target.value })} placeholder="Enter country" />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Input id="rating" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} placeholder="Enter rating (e.g., 4.5)" />
                </div>
                <div>
                  <Label htmlFor="rank">Rank</Label>
                  <Input id="rank" value={formData.rank} onChange={(e) => setFormData({ ...formData, rank: e.target.value })} placeholder="Enter rank" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Switch id="isActive" checked={identity.isActive} onCheckedChange={(v) => setIdentity({ ...identity, isActive: v })} />
                <Label htmlFor="isActive" className="cursor-pointer">Active — university is published and visible to learners</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Branding & Hero</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ImageField label="Logo" value={identity.logo} onChange={(v) => setIdentity({ ...identity, logo: v })} />
              <div>
                <Label htmlFor="banners">Hero Image</Label>
                <div className="flex items-center gap-2">
                  <Input id="banners" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} className="cursor-pointer" />
                </div>
                <Input id="bannerUrl" type="url" className="mt-2" placeholder="...or paste an image URL" value={formData.coverImage.startsWith('data:') ? '' : formData.coverImage} onChange={e => setFormData({ ...formData, coverImage: e.target.value })} />
                {formData.coverImage && <div className="mt-2 space-y-2"><img src={formData.coverImage} alt={identity.heroImageAlt || 'University hero'} className="max-h-48 w-full object-contain border rounded-lg" /><Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, coverImage: '' })}>Remove</Button></div>}
              </div>
              <div>
                <Label htmlFor="heroImageAlt">Hero Image Alt Text</Label>
                <Input id="heroImageAlt" value={identity.heroImageAlt} onChange={(e) => setIdentity({ ...identity, heroImageAlt: e.target.value })} placeholder="Describe the hero image for accessibility" />
              </div>
              <div>
                <Label htmlFor="about">Description</Label>
                <Textarea id="about" value={formData.about} onChange={(e) => setFormData({ ...formData, about: e.target.value })} placeholder="Enter information about the university..." rows={6} className="resize-none" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 2. FACTS & OVERVIEW ============ */}
        <TabsContent value="facts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Key Statistics</CardTitle>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setKeyStatistics([...keyStatistics, { id: uid(), label: '', value: '', unit: '', context: '' }])}>
                  <Plus className="w-4 h-4" /> Add Statistic
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {keyStatistics.length === 0 && <p className="text-sm text-muted-foreground">No key statistics yet. Add figures like student counts, employability or rankings.</p>}
              {keyStatistics.map((stat, i) => (
                <div key={stat.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Statistic {i + 1}</p>
                    <div className="flex items-center gap-1">
                      <MoveButtons index={i} total={keyStatistics.length} onMove={(f, t) => setKeyStatistics(moveItem(keyStatistics, f, t))} />
                      <Button type="button" variant="ghost" size="icon" aria-label="Remove statistic" onClick={() => setKeyStatistics(keyStatistics.filter(s => s.id !== stat.id))}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <Label>Label</Label>
                      <Input value={stat.label} onChange={(e) => setKeyStatistics(keyStatistics.map(s => s.id === stat.id ? { ...s, label: e.target.value } : s))} placeholder="e.g. Total Students" />
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input value={stat.value} onChange={(e) => setKeyStatistics(keyStatistics.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s))} placeholder="e.g. 8,500" />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Input value={stat.unit || ''} onChange={(e) => setKeyStatistics(keyStatistics.map(s => s.id === stat.id ? { ...s, unit: e.target.value } : s))} placeholder="e.g. %, students" />
                    </div>
                    <div>
                      <Label>Context / Period</Label>
                      <Input value={stat.context || ''} onChange={(e) => setKeyStatistics(keyStatistics.map(s => s.id === stat.id ? { ...s, context: e.target.value } : s))} placeholder="e.g. 2025 intake" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>At-a-Glance Facts</CardTitle>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setAtAGlanceFacts([...atAGlanceFacts, ''])}>
                  <Plus className="w-4 h-4" /> Add Fact
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {atAGlanceFacts.length === 0 && <p className="text-sm text-muted-foreground">Short one-line facts shown at a glance, e.g. "4 campus locations".</p>}
              {atAGlanceFacts.map((fact, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={fact} onChange={(e) => setAtAGlanceFacts(atAGlanceFacts.map((f, idx) => idx === i ? e.target.value : f))} placeholder={`Fact ${i + 1}`} />
                  <MoveButtons index={i} total={atAGlanceFacts.length} onMove={(f, t) => setAtAGlanceFacts(moveItem(atAGlanceFacts, f, t))} />
                  <Button type="button" variant="ghost" size="icon" aria-label="Remove fact" onClick={() => setAtAGlanceFacts(atAGlanceFacts.filter((_, idx) => idx !== i))}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Overview Callout</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={overviewCallout} onChange={(e) => setOverviewCallout(e.target.value)} placeholder="A short highlighted message shown prominently in the overview, e.g. 'Your campus depends on your chosen programme...'" rows={3} className="resize-none" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Section Ordering</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">Control the order in which sections appear on the university detail page.</p>
              {sectionOrder.map((key, i) => (
                <div key={key} className="flex items-center justify-between border rounded-lg px-4 py-2">
                  <span className="font-medium">{i + 1}. {SECTION_DEFS.find(s => s.key === key)?.label || key}</span>
                  <MoveButtons index={i} total={sectionOrder.length} onMove={(f, t) => setSectionOrder(moveItem(sectionOrder, f, t))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 3. HIGHLIGHTS ============ */}
        <TabsContent value="highlights" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>University Highlights</CardTitle>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setHighlightCards([...highlightCards, { id: uid(), title: '', description: '', detailedContent: '', image: '', order: highlightCards.length }])}>
                  <Plus className="w-4 h-4" /> Add Highlight
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {highlightCards.length === 0 && <p className="text-sm text-muted-foreground">Highlight cards like "Explore your study pathway" or "Discover campus life".</p>}
              {highlightCards.map((card, i) => (
                <div key={card.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Highlight {i + 1}</p>
                    <div className="flex items-center gap-1">
                      <MoveButtons index={i} total={highlightCards.length} onMove={(f, t) => setHighlightCards(moveItem(highlightCards, f, t))} />
                      <Button type="button" variant="ghost" size="icon" aria-label="Remove highlight" onClick={() => setHighlightCards(highlightCards.filter(h => h.id !== card.id))}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Title</Label>
                      <Input value={card.title} onChange={(e) => setHighlightCards(highlightCards.map(h => h.id === card.id ? { ...h, title: e.target.value } : h))} placeholder="e.g. Discover campus life" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input value={card.description} onChange={(e) => setHighlightCards(highlightCards.map(h => h.id === card.id ? { ...h, description: e.target.value } : h))} placeholder="Short card description" />
                    </div>
                  </div>
                  <div>
                    <Label>Detailed Content (optional — shown in expanded view)</Label>
                    <Textarea value={card.detailedContent || ''} onChange={(e) => setHighlightCards(highlightCards.map(h => h.id === card.id ? { ...h, detailedContent: e.target.value } : h))} rows={3} className="resize-none" placeholder="Longer content shown when the learner opens the highlight" />
                  </div>
                  <ImageField label="Image / Icon" value={card.image || ''} onChange={(v) => setHighlightCards(highlightCards.map(h => h.id === card.id ? { ...h, image: v } : h))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 4. CAMPUS, VIDEO & GALLERY ============ */}
        <TabsContent value="campus" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Campus Locations</CardTitle>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setCampuses([...campuses, { id: uid(), name: '', location: '', description: '', specializations: [] }])}>
                  <Plus className="w-4 h-4" /> Add Campus
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {campuses.length === 0 && <p className="text-sm text-muted-foreground">Add each campus with its name, location and a short description.</p>}
              {campuses.map((campus, i) => (
                <div key={campus.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Campus {i + 1}</p>
                    <Button type="button" variant="ghost" size="icon" aria-label="Remove campus" onClick={() => setCampuses(campuses.filter(c => c.id !== campus.id))}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Name</Label>
                      <Input value={campus.name} onChange={(e) => setCampuses(campuses.map(c => c.id === campus.id ? { ...c, name: e.target.value } : c))} placeholder="e.g. Mikkeli Campus" />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={campus.location} onChange={(e) => setCampuses(campuses.map(c => c.id === campus.id ? { ...c, location: e.target.value } : c))} placeholder="e.g. Mikkeli, Finland" />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={campus.description || ''} onChange={(e) => setCampuses(campuses.map(c => c.id === campus.id ? { ...c, description: e.target.value } : c))} rows={2} className="resize-none" placeholder="What is based at this campus" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>University Video</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Title</Label>
                  <Input value={video.title} onChange={(e) => setVideo({ ...video, title: e.target.value })} placeholder="e.g. Life at our university" />
                </div>
                <div>
                  <Label>Video Source (URL)</Label>
                  <Input type="url" value={video.url} onChange={(e) => setVideo({ ...video, url: e.target.value })} placeholder="https://... (YouTube, Vimeo or MP4)" />
                </div>
              </div>
              <ImageField label="Poster Image" value={video.poster} onChange={(v) => setVideo({ ...video, poster: v })} />
              <div>
                <Label>Caption</Label>
                <Input value={video.caption} onChange={(e) => setVideo({ ...video, caption: e.target.value })} placeholder="Short caption shown with the video" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Photo Gallery</CardTitle>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setGallery([...gallery, { id: uid(), image: '', alt: '', caption: '', order: gallery.length }])}>
                  <Plus className="w-4 h-4" /> Add Image
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {gallery.length === 0 && <p className="text-sm text-muted-foreground">Gallery images with captions, e.g. "Campus life", "Study spaces".</p>}
              {gallery.map((img, i) => (
                <div key={img.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Image {i + 1}</p>
                    <div className="flex items-center gap-1">
                      <MoveButtons index={i} total={gallery.length} onMove={(f, t) => setGallery(moveItem(gallery, f, t))} />
                      <Button type="button" variant="ghost" size="icon" aria-label="Remove image" onClick={() => setGallery(gallery.filter(g => g.id !== img.id))}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <ImageField label="Image" value={img.image} onChange={(v) => setGallery(gallery.map(g => g.id === img.id ? { ...g, image: v } : g))} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Alt Text</Label>
                      <Input value={img.alt || ''} onChange={(e) => setGallery(gallery.map(g => g.id === img.id ? { ...g, alt: e.target.value } : g))} placeholder="Describe the image" />
                    </div>
                    <div>
                      <Label>Caption</Label>
                      <Input value={img.caption || ''} onChange={(e) => setGallery(gallery.map(g => g.id === img.id ? { ...g, caption: e.target.value } : g))} placeholder="e.g. Study spaces" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 5. INTERNATIONAL PARTNERS ============ */}
        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>International Partners</CardTitle>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setPartners([...partners, { id: uid(), name: '', type: '', description: '', logo: '' }])}>
                  <Plus className="w-4 h-4" /> Add Partner
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {partners.length === 0 && <p className="text-sm text-muted-foreground">Partner institutions, alliances and networks, e.g. "INGENIUM European University".</p>}
              {partners.map((partner, i) => (
                <div key={partner.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Partner {i + 1}</p>
                    <Button type="button" variant="ghost" size="icon" aria-label="Remove partner" onClick={() => setPartners(partners.filter(p => p.id !== partner.id))}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Partner Name</Label>
                      <Input value={partner.name} onChange={(e) => setPartners(partners.map(p => p.id === partner.id ? { ...p, name: e.target.value } : p))} placeholder="e.g. INGENIUM European University" />
                    </div>
                    <div>
                      <Label>Type / Category</Label>
                      <Input value={partner.type || ''} onChange={(e) => setPartners(partners.map(p => p.id === partner.id ? { ...p, type: e.target.value } : p))} placeholder="e.g. Alliance, Exchange Partner" />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={partner.description || ''} onChange={(e) => setPartners(partners.map(p => p.id === partner.id ? { ...p, description: e.target.value } : p))} rows={2} className="resize-none" placeholder="How the university works with this partner" />
                  </div>
                  <ImageField label="Logo / Image" value={partner.logo || ''} onChange={(v) => setPartners(partners.map(p => p.id === partner.id ? { ...p, logo: v } : p))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 6. ADMISSIONS & SUPPORT ============ */}
        <TabsContent value="admissions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Admissions Information Cards</CardTitle>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setAdmissionCards([...admissionCards, { id: uid(), title: '', description: '', detailedContent: '', icon: '' }])}>
                  <Plus className="w-4 h-4" /> Add Card
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {admissionCards.length === 0 && <p className="text-sm text-muted-foreground">Cards such as "How to apply", "Entry requirements" or "Tuition & fees".</p>}
              {admissionCards.map((card, i) => (
                <div key={card.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Card {i + 1}</p>
                    <Button type="button" variant="ghost" size="icon" aria-label="Remove card" onClick={() => setAdmissionCards(admissionCards.filter(c => c.id !== card.id))}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Title</Label>
                      <Input value={card.title} onChange={(e) => setAdmissionCards(admissionCards.map(c => c.id === card.id ? { ...c, title: e.target.value } : c))} placeholder="e.g. How to apply" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input value={card.description} onChange={(e) => setAdmissionCards(admissionCards.map(c => c.id === card.id ? { ...c, description: e.target.value } : c))} placeholder="Short summary" />
                    </div>
                  </div>
                  <div>
                    <Label>Detailed Content (optional)</Label>
                    <Textarea value={card.detailedContent || ''} onChange={(e) => setAdmissionCards(admissionCards.map(c => c.id === card.id ? { ...c, detailedContent: e.target.value } : c))} rows={3} className="resize-none" />
                  </div>
                  <ImageField label="Icon / Image (optional)" value={card.icon || ''} onChange={(v) => setAdmissionCards(admissionCards.map(c => c.id === card.id ? { ...c, icon: v } : c))} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Application Requirements Summary</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={applicationRequirements} onChange={(e) => setApplicationRequirements(e.target.value)} rows={4} className="resize-none" placeholder="Summarise entry requirements, documents and deadlines" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Admissions Contact</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input type="email" value={admissionContact.email} onChange={(e) => setAdmissionContact({ ...admissionContact, email: e.target.value })} placeholder="admissions@university.edu" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={admissionContact.phone} onChange={(e) => setAdmissionContact({ ...admissionContact, phone: e.target.value })} placeholder="+358 ..." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>FAQs</CardTitle>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setFaqs([...faqs, { id: uid(), question: '', answer: '', order: faqs.length }])}>
                  <Plus className="w-4 h-4" /> Add FAQ
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.length === 0 && <p className="text-sm text-muted-foreground">Structured questions and answers shown to applicants.</p>}
              {faqs.map((faq, i) => (
                <div key={faq.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">FAQ {i + 1}</p>
                    <div className="flex items-center gap-1">
                      <MoveButtons index={i} total={faqs.length} onMove={(f, t) => setFaqs(moveItem(faqs, f, t))} />
                      <Button type="button" variant="ghost" size="icon" aria-label="Remove FAQ" onClick={() => setFaqs(faqs.filter(q => q.id !== faq.id))}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Question</Label>
                    <Input value={faq.question} onChange={(e) => setFaqs(faqs.map(q => q.id === faq.id ? { ...q, question: e.target.value } : q))} placeholder="e.g. Do you offer scholarships?" />
                  </div>
                  <div>
                    <Label>Answer</Label>
                    <Textarea value={faq.answer} onChange={(e) => setFaqs(faqs.map(q => q.id === faq.id ? { ...q, answer: e.target.value } : q))} rows={3} className="resize-none" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ 7. CONTENT SECTIONS (existing long-form fields) ============ */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Brochure</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Input id="brochure" type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'brochureUrl')} className="cursor-pointer" />
              </div>
              <Label htmlFor="brochureUrl">Brochure URL</Label>
              <Input id="brochureUrl" type="url" value={formData.brochureUrl.startsWith('data:') ? '' : formData.brochureUrl} onChange={e => setFormData({ ...formData, brochureUrl: e.target.value })} />
              {formData.brochureUrl && <div className="flex items-center gap-3 mt-2"><a className="text-primary underline" href={formData.brochureUrl} target="_blank" rel="noreferrer">View brochure</a><Button variant="ghost" size="sm" onClick={() => setFormData({ ...formData, brochureUrl: '' })}>Remove</Button></div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Why This University</CardTitle></CardHeader>
            <CardContent>
              <Textarea aria-label="Why This University" value={formData.whyThisUniversity} onChange={(e) => setFormData({ ...formData, whyThisUniversity: e.target.value })} placeholder="Explain why students should choose this university..." rows={6} className="resize-none" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Admission</CardTitle></CardHeader>
            <CardContent>
              <Textarea aria-label="Admission" value={formData.admission} onChange={(e) => setFormData({ ...formData, admission: e.target.value })} placeholder="Enter admission requirements and process..." rows={6} className="resize-none" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Placements</CardTitle></CardHeader>
            <CardContent>
              <Textarea aria-label="Placements" value={formData.placements} onChange={(e) => setFormData({ ...formData, placements: e.target.value })} placeholder="Enter placement information..." rows={6} className="resize-none" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>FAQ (free text)</CardTitle></CardHeader>
            <CardContent>
              <Textarea aria-label="FAQ" value={formData.faq} onChange={(e) => setFormData({ ...formData, faq: e.target.value })} placeholder="Enter frequently asked questions..." rows={6} className="resize-none" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Testimonial</CardTitle></CardHeader>
            <CardContent>
              <Textarea aria-label="Testimonial" value={formData.testimonial} onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })} placeholder="Enter testimonials..." rows={6} className="resize-none" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversityDetails;
