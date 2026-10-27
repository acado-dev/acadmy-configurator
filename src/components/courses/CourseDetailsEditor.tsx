import React from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Link2,
  FileText,
  Quote,
  Sparkles,
  ListChecks,
  Briefcase,
  Info,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Course,
  CourseQuickFact,
  CourseBenefit,
  CourseSkill,
  CourseCareerPath,
  CourseTestimonial,
  CourseInfoSection,
} from '@/types/course';
import { newEntryId } from '@/lib/courseDetails';
import { toast } from '@/hooks/use-toast';

export type CourseDetailsData = Pick<
  Course,
  | 'slug'
  | 'city'
  | 'country'
  | 'language'
  | 'studyMode'
  | 'duration'
  | 'credits'
  | 'intakePeriod'
  | 'applicationOpenDate'
  | 'applicationDeadline'
  | 'applicationStatus'
  | 'tuitionFee'
  | 'tuitionCurrency'
  | 'scholarshipAvailable'
  | 'heroAltText'
  | 'summary'
  | 'descriptionBlocks'
  | 'highlightCallout'
  | 'quickFacts'
  | 'benefits'
  | 'programmeGuideUrl'
  | 'programmeGuideName'
  | 'outcomeBullets'
  | 'skills'
  | 'careerPaths'
  | 'testimonials'
  | 'infoSections'
>;

export const emptyCourseDetails: CourseDetailsData = {
  slug: '',
  city: '',
  country: '',
  language: '',
  studyMode: '',
  duration: '',
  credits: '',
  intakePeriod: '',
  applicationOpenDate: '',
  applicationDeadline: '',
  applicationStatus: 'open',
  tuitionFee: '',
  tuitionCurrency: 'EUR',
  scholarshipAvailable: false,
  heroAltText: '',
  summary: '',
  descriptionBlocks: [],
  highlightCallout: '',
  quickFacts: [],
  benefits: [],
  programmeGuideUrl: '',
  programmeGuideName: '',
  outcomeBullets: [],
  skills: [],
  careerPaths: [],
  testimonials: [],
  infoSections: [],
};

export const extractCourseDetails = (course: Partial<Course>): CourseDetailsData => ({
  ...emptyCourseDetails,
  slug: course.slug || '',
  city: course.city || '',
  country: course.country || '',
  language: course.language || '',
  studyMode: course.studyMode || '',
  duration: course.duration || '',
  credits: course.credits || '',
  intakePeriod: course.intakePeriod || '',
  applicationOpenDate: course.applicationOpenDate || '',
  applicationDeadline: course.applicationDeadline || '',
  applicationStatus: course.applicationStatus || 'open',
  tuitionFee: course.tuitionFee || '',
  tuitionCurrency: course.tuitionCurrency || 'EUR',
  scholarshipAvailable: course.scholarshipAvailable || false,
  heroAltText: course.heroAltText || '',
  summary: course.summary || '',
  descriptionBlocks: course.descriptionBlocks || [],
  highlightCallout: course.highlightCallout || '',
  quickFacts: course.quickFacts || [],
  benefits: course.benefits || [],
  programmeGuideUrl: course.programmeGuideUrl || '',
  programmeGuideName: course.programmeGuideName || '',
  outcomeBullets: course.outcomeBullets || [],
  skills: course.skills || [],
  careerPaths: course.careerPaths || [],
  testimonials: course.testimonials || [],
  infoSections: course.infoSections || [],
});

interface Props {
  value: CourseDetailsData;
  onChange: (next: CourseDetailsData) => void;
}

const MAX_GUIDE_SIZE = 5 * 1024 * 1024; // 5 MB

const CourseDetailsEditor: React.FC<Props> = ({ value, onChange }) => {
  const set = <K extends keyof CourseDetailsData>(key: K, v: CourseDetailsData[K]) =>
    onChange({ ...value, [key]: v });

  const move = <T,>(arr: T[], index: number, dir: -1 | 1): T[] => {
    const next = [...arr];
    const target = index + dir;
    if (target < 0 || target >= next.length) return next;
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  };

  const reorderButtons = (
    index: number,
    length: number,
    onMove: (dir: -1 | 1) => void
  ) => (
    <div className="flex flex-col gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={index === 0}
        onClick={() => onMove(-1)}
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={index === length - 1}
        onClick={() => onMove(1)}
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </Button>
    </div>
  );

  const handleGuideUpload = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file',
        description: 'Programme guide must be a PDF file',
        variant: 'destructive',
      });
      return;
    }
    if (file.size > MAX_GUIDE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Programme guide must be 5 MB or smaller',
        variant: 'destructive',
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({
        ...value,
        programmeGuideUrl: reader.result as string,
        programmeGuideName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePortraitUpload = (file: File, id: string) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      set(
        'testimonials',
        value.testimonials!.map((t) =>
          t.id === id ? { ...t, portrait: reader.result as string } : t
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const studentTestimonials = (value.testimonials || []).filter((t) => t.kind === 'student');
  const facultyTestimonials = (value.testimonials || []).filter((t) => t.kind === 'faculty');

  const updateTestimonial = (id: string, patch: Partial<CourseTestimonial>) =>
    set(
      'testimonials',
      (value.testimonials || []).map((t) => (t.id === id ? { ...t, ...patch } : t))
    );

  const testimonialCard = (t: CourseTestimonial, kindList: CourseTestimonial[]) => {
    const index = kindList.findIndex((x) => x.id === t.id);
    return (
      <div key={t.id} className="rounded-lg border p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Quote className="w-4 h-4" />
            Testimonial {index + 1}
          </div>
          <div className="flex items-center gap-1">
            {reorderButtons(index, kindList.length, (dir) => {
              const reordered = move(kindList, index, dir);
              const others = (value.testimonials || []).filter((x) => x.kind !== t.kind);
              set('testimonials', t.kind === 'student' ? [...reordered, ...others] : [...others, ...reordered]);
            })}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() =>
                set('testimonials', (value.testimonials || []).filter((x) => x.id !== t.id))
              }
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input
              value={t.name}
              onChange={(e) => updateTestimonial(t.id, { name: e.target.value })}
              placeholder="e.g., Vilde Bryn"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t.kind === 'student' ? 'Course / Year' : 'Faculty Title'}</Label>
            <Input
              value={t.title}
              onChange={(e) => updateTestimonial(t.id, { title: e.target.value })}
              placeholder={
                t.kind === 'student'
                  ? "e.g., Master's student, Xamk University"
                  : 'e.g., Programme Director'
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Quote</Label>
          <Textarea
            value={t.quote}
            onChange={(e) => updateTestimonial(t.id, { quote: e.target.value })}
            placeholder="Short testimonial quote..."
            rows={2}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Portrait Image</Label>
          <div className="flex items-center gap-3">
            <Input
              value={t.portrait?.startsWith('data:') ? '' : t.portrait || ''}
              onChange={(e) => updateTestimonial(t.id, { portrait: e.target.value })}
              placeholder="https://example.com/portrait.jpg"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById(`portrait-${t.id}`)?.click()}
            >
              <Upload className="w-3.5 h-3.5 mr-1" />
              Upload
            </Button>
            <input
              id={`portrait-${t.id}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handlePortraitUpload(f, t.id);
              }}
            />
          </div>
          {t.portrait && (
            <img
              src={t.portrait}
              alt={t.name}
              className="w-14 h-14 rounded-full object-cover border"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Study Details */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Study Details</h2>
            <p className="text-sm text-muted-foreground">
              Location, delivery, duration, fees and application timeline shown on the course page
            </p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Internal ID / Slug</Label>
              <Input
                value={value.slug || ''}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="e.g., research-fellowship-business-innovation"
              />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={value.city || ''}
                onChange={(e) => set('city', e.target.value)}
                placeholder="e.g., Mikkeli"
              />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input
                value={value.country || ''}
                onChange={(e) => set('country', e.target.value)}
                placeholder="e.g., Finland"
              />
            </div>
            <div className="space-y-2">
              <Label>Language of Instruction</Label>
              <Input
                value={value.language || ''}
                onChange={(e) => set('language', e.target.value)}
                placeholder="e.g., English"
              />
            </div>
            <div className="space-y-2">
              <Label>Study Mode</Label>
              <Select
                value={value.studyMode || ''}
                onValueChange={(v) => set('studyMode', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select study mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Blended">Blended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={value.duration || ''}
                onChange={(e) => set('duration', e.target.value)}
                placeholder="e.g., 18 months"
              />
            </div>
            <div className="space-y-2">
              <Label>Credits / ECTS</Label>
              <Input
                value={value.credits || ''}
                onChange={(e) => set('credits', e.target.value)}
                placeholder="e.g., 120 ECTS"
              />
            </div>
            <div className="space-y-2">
              <Label>Intake Period</Label>
              <Input
                value={value.intakePeriod || ''}
                onChange={(e) => set('intakePeriod', e.target.value)}
                placeholder="e.g., January 2027"
              />
            </div>
            <div className="space-y-2">
              <Label>Application Status</Label>
              <Select
                value={value.applicationStatus || 'open'}
                onValueChange={(v) =>
                  set('applicationStatus', v as CourseDetailsData['applicationStatus'])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closing-soon">Closing Soon</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Application Opening Date</Label>
              <Input
                type="date"
                value={value.applicationOpenDate || ''}
                onChange={(e) => set('applicationOpenDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Application Deadline</Label>
              <Input
                type="date"
                value={value.applicationDeadline || ''}
                onChange={(e) => set('applicationDeadline', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tuition Fee Amount</Label>
              <Input
                value={value.tuitionFee || ''}
                onChange={(e) => set('tuitionFee', e.target.value)}
                placeholder="e.g., 15000 (0 = no fee)"
              />
            </div>
            <div className="space-y-2">
              <Label>Fee Currency</Label>
              <Select
                value={value.tuitionCurrency || 'EUR'}
                onValueChange={(v) => set('tuitionCurrency', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50 md:col-span-2">
              <div className="space-y-0.5">
                <Label className="text-base">Scholarship Available</Label>
                <p className="text-sm text-muted-foreground">
                  Show scholarship availability on the course page
                </p>
              </div>
              <Switch
                checked={value.scholarshipAvailable || false}
                onCheckedChange={(v) => set('scholarshipAvailable', v)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Hero alt text */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Hero Accessibility</h2>
            <p className="text-sm text-muted-foreground">
              Alternative text for the banner/hero image
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Hero Image Alt Text</Label>
            <Input
              value={value.heroAltText || ''}
              onChange={(e) => set('heroAltText', e.target.value)}
              placeholder="e.g., Xamk campus building in Mikkeli, Finland"
            />
          </div>
        </div>
      </Card>

      {/* Programme Overview */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Programme Overview</h2>
            <p className="text-sm text-muted-foreground">
              Summary, description blocks, callout, quick facts and benefit cards
            </p>
          </div>
          <Separator />

          <div className="space-y-2">
            <Label>Short Summary</Label>
            <Textarea
              value={value.summary || ''}
              onChange={(e) => set('summary', e.target.value)}
              placeholder="One or two sentences shown at the top of the overview..."
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Description Blocks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => set('descriptionBlocks', [...(value.descriptionBlocks || []), ''])}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Block
              </Button>
            </div>
            {(value.descriptionBlocks || []).map((block, i) => (
              <div key={i} className="flex items-start gap-2">
                <Textarea
                  value={block}
                  onChange={(e) =>
                    set(
                      'descriptionBlocks',
                      (value.descriptionBlocks || []).map((b, bi) =>
                        bi === i ? e.target.value : b
                      )
                    )
                  }
                  placeholder={`Paragraph ${i + 1}...`}
                  rows={3}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() =>
                    set(
                      'descriptionBlocks',
                      (value.descriptionBlocks || []).filter((_, bi) => bi !== i)
                    )
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Highlight Callout</Label>
            <Input
              value={value.highlightCallout || ''}
              onChange={(e) => set('highlightCallout', e.target.value)}
              placeholder="e.g., Fellowships · 18 months · Research — English · Mikkeli, Finland"
            />
          </div>

          {/* Quick facts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Quick Fact Cards
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  set('quickFacts', [
                    ...(value.quickFacts || []),
                    { id: newEntryId(), label: '', value: '' },
                  ])
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Fact
              </Button>
            </div>
            {(value.quickFacts || []).map((fact, i) => (
              <div key={fact.id} className="flex items-center gap-2">
                {reorderButtons(i, (value.quickFacts || []).length, (dir) =>
                  set('quickFacts', move(value.quickFacts || [], i, dir))
                )}
                <Input
                  value={fact.label}
                  onChange={(e) =>
                    set(
                      'quickFacts',
                      (value.quickFacts || []).map((f) =>
                        f.id === fact.id ? { ...f, label: e.target.value } : f
                      )
                    )
                  }
                  placeholder="Label (e.g., Duration)"
                  className="max-w-[200px]"
                />
                <Input
                  value={fact.value}
                  onChange={(e) =>
                    set(
                      'quickFacts',
                      (value.quickFacts || []).map((f) =>
                        f.id === fact.id ? { ...f, value: e.target.value } : f
                      )
                    )
                  }
                  placeholder="Value (e.g., 18 months)"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() =>
                    set(
                      'quickFacts',
                      (value.quickFacts || []).filter((f) => f.id !== fact.id)
                    )
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                "Why Study This Programme?" Cards
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  set('benefits', [
                    ...(value.benefits || []),
                    { id: newEntryId(), title: '', description: '', icon: '' },
                  ])
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Card
              </Button>
            </div>
            {(value.benefits || []).map((b, i) => (
              <div key={b.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Card {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    {reorderButtons(i, (value.benefits || []).length, (dir) =>
                      set('benefits', move(value.benefits || [], i, dir))
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() =>
                        set(
                          'benefits',
                          (value.benefits || []).filter((x) => x.id !== b.id)
                        )
                      }
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    value={b.title}
                    onChange={(e) =>
                      set(
                        'benefits',
                        (value.benefits || []).map((x) =>
                          x.id === b.id ? { ...x, title: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Title (e.g., Learn)"
                  />
                  <Input
                    value={b.icon || ''}
                    onChange={(e) =>
                      set(
                        'benefits',
                        (value.benefits || []).map((x) =>
                          x.id === b.id ? { ...x, icon: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Icon/image URL (optional)"
                  />
                </div>
                <Textarea
                  value={b.description}
                  onChange={(e) =>
                    set(
                      'benefits',
                      (value.benefits || []).map((x) =>
                        x.id === b.id ? { ...x, description: e.target.value } : x
                      )
                    )
                  }
                  placeholder="Short description..."
                  rows={2}
                />
              </div>
            ))}
          </div>

          {/* Programme guide PDF */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Programme Guide (PDF, max 5 MB)
            </Label>
            <Tabs defaultValue="url">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="url" className="gap-2">
                  <Link2 className="w-3 h-3" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="upload" className="gap-2">
                  <Upload className="w-3 h-3" />
                  Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-2">
                <Input
                  value={
                    value.programmeGuideUrl?.startsWith('data:')
                      ? ''
                      : value.programmeGuideUrl || ''
                  }
                  onChange={(e) =>
                    onChange({
                      ...value,
                      programmeGuideUrl: e.target.value,
                      programmeGuideName: e.target.value
                        ? value.programmeGuideName || 'Programme Guide.pdf'
                        : '',
                    })
                  }
                  placeholder="https://example.com/programme-guide.pdf"
                  type="url"
                />
              </TabsContent>
              <TabsContent value="upload" className="space-y-2">
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('guide-upload')?.click()}
                >
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload PDF</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF up to 5 MB</p>
                  <input
                    id="guide-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleGuideUpload(f);
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
            {value.programmeGuideUrl && (
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-primary" />
                  {value.programmeGuideName || 'Programme Guide.pdf'}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() =>
                    onChange({ ...value, programmeGuideUrl: '', programmeGuideName: '' })
                  }
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Learning Outcomes & Skills */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Learning Outcomes & Skills</h2>
            <p className="text-sm text-muted-foreground">
              Outcome bullet points and skills gained
            </p>
          </div>
          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Learning Outcome Bullets
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => set('outcomeBullets', [...(value.outcomeBullets || []), ''])}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Outcome
              </Button>
            </div>
            {(value.outcomeBullets || []).map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                {reorderButtons(i, (value.outcomeBullets || []).length, (dir) =>
                  set('outcomeBullets', move(value.outcomeBullets || [], i, dir))
                )}
                <Input
                  value={o}
                  onChange={(e) =>
                    set(
                      'outcomeBullets',
                      (value.outcomeBullets || []).map((x, xi) =>
                        xi === i ? e.target.value : x
                      )
                    )
                  }
                  placeholder="e.g., Apply core Business theory to authentic problems"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() =>
                    set(
                      'outcomeBullets',
                      (value.outcomeBullets || []).filter((_, xi) => xi !== i)
                    )
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Skills Gained</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  set('skills', [
                    ...(value.skills || []),
                    { id: newEntryId(), title: '', description: '', icon: '' },
                  ])
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Skill
              </Button>
            </div>
            {(value.skills || []).map((s) => (
              <div key={s.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() =>
                      set('skills', (value.skills || []).filter((x) => x.id !== s.id))
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    value={s.title}
                    onChange={(e) =>
                      set(
                        'skills',
                        (value.skills || []).map((x) =>
                          x.id === s.id ? { ...x, title: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Skill title"
                  />
                  <Input
                    value={s.icon || ''}
                    onChange={(e) =>
                      set(
                        'skills',
                        (value.skills || []).map((x) =>
                          x.id === s.id ? { ...x, icon: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Icon/image URL (optional)"
                  />
                </div>
                <Textarea
                  value={s.description}
                  onChange={(e) =>
                    set(
                      'skills',
                      (value.skills || []).map((x) =>
                        x.id === s.id ? { ...x, description: e.target.value } : x
                      )
                    )
                  }
                  placeholder="Short description..."
                  rows={2}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Career Pathways */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Career Pathways
              </h2>
              <p className="text-sm text-muted-foreground">
                Roles graduates typically move into
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                set('careerPaths', [
                  ...(value.careerPaths || []),
                  { id: newEntryId(), role: '', description: '', salaryContext: '', image: '' },
                ])
              }
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Pathway
            </Button>
          </div>
          <Separator />
          {(value.careerPaths || []).map((c, i) => (
            <div key={c.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Pathway {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  {reorderButtons(i, (value.careerPaths || []).length, (dir) =>
                    set('careerPaths', move(value.careerPaths || [], i, dir))
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() =>
                      set(
                        'careerPaths',
                        (value.careerPaths || []).filter((x) => x.id !== c.id)
                      )
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  value={c.role}
                  onChange={(e) =>
                    set(
                      'careerPaths',
                      (value.careerPaths || []).map((x) =>
                        x.id === c.id ? { ...x, role: e.target.value } : x
                      )
                    )
                  }
                  placeholder="Job role (e.g., Business Analyst)"
                />
                <Input
                  value={c.salaryContext || ''}
                  onChange={(e) =>
                    set(
                      'careerPaths',
                      (value.careerPaths || []).map((x) =>
                        x.id === c.id ? { ...x, salaryContext: e.target.value } : x
                      )
                    )
                  }
                  placeholder="Salary/context (optional)"
                />
              </div>
              <Textarea
                value={c.description}
                onChange={(e) =>
                  set(
                    'careerPaths',
                    (value.careerPaths || []).map((x) =>
                      x.id === c.id ? { ...x, description: e.target.value } : x
                    )
                  )
                }
                placeholder="Short description..."
                rows={2}
              />
              <Input
                value={c.image || ''}
                onChange={(e) =>
                  set(
                    'careerPaths',
                    (value.careerPaths || []).map((x) =>
                      x.id === c.id ? { ...x, image: e.target.value } : x
                    )
                  )
                }
                placeholder="Image URL (optional)"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Testimonials */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Testimonials</h2>
            <p className="text-sm text-muted-foreground">
              Student and faculty stories shown on the course page
            </p>
          </div>
          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Student Testimonials</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  set('testimonials', [
                    ...(value.testimonials || []),
                    {
                      id: newEntryId(),
                      kind: 'student',
                      name: '',
                      title: '',
                      quote: '',
                      portrait: '',
                    },
                  ])
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Student
              </Button>
            </div>
            {studentTestimonials.map((t) => testimonialCard(t, studentTestimonials))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Faculty Testimonials</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  set('testimonials', [
                    ...(value.testimonials || []),
                    {
                      id: newEntryId(),
                      kind: 'faculty',
                      name: '',
                      title: '',
                      quote: '',
                      portrait: '',
                    },
                  ])
                }
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Faculty
              </Button>
            </div>
            {facultyTestimonials.map((t) => testimonialCard(t, facultyTestimonials))}
          </div>
        </div>
      </Card>

      {/* Programme Information accordions */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">Programme Information</h2>
              <p className="text-sm text-muted-foreground">
                Expandable sections such as Curriculum, Eligibility, Fees & Funding, Visa Support
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                set('infoSections', [
                  ...(value.infoSections || []),
                  { id: newEntryId(), title: '', content: '' },
                ])
              }
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Section
            </Button>
          </div>
          <Separator />
          {(value.infoSections || []).map((s, i) => (
            <div key={s.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Section {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  {reorderButtons(i, (value.infoSections || []).length, (dir) =>
                    set('infoSections', move(value.infoSections || [], i, dir))
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() =>
                      set(
                        'infoSections',
                        (value.infoSections || []).filter((x) => x.id !== s.id)
                      )
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <Input
                value={s.title}
                onChange={(e) =>
                  set(
                    'infoSections',
                    (value.infoSections || []).map((x) =>
                      x.id === s.id ? { ...x, title: e.target.value } : x
                    )
                  )
                }
                placeholder="Section title (e.g., Eligibility Criteria)"
              />
              <Textarea
                value={s.content}
                onChange={(e) =>
                  set(
                    'infoSections',
                    (value.infoSections || []).map((x) =>
                      x.id === s.id ? { ...x, content: e.target.value } : x
                    )
                  )
                }
                placeholder="Section content..."
                rows={3}
              />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default CourseDetailsEditor;
