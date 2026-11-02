import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Clock,
  MapPin,
  GraduationCap,
  Calendar,
  CheckCircle,
  Award,
  Globe,
  Heart,
  Download,
  Briefcase,
  Sparkles,
  Quote,
  Users,
} from "lucide-react";
import { Course } from "@/types/course";
import { University } from "@/types/application";
import {
  ensureCourseDetailsSeed,
  resolveProgrammeGroups,
  getCourseInterestCount,
  getInterestUserKey,
  hasUserMarkedInterest,
  markCourseInterest,
  unmarkCourseInterest,
} from "@/lib/courseDetails";
import { toast } from "@/hooks/use-toast";

const currencySymbol = (code?: string) =>
  ({ EUR: "€", USD: "$", GBP: "£", INR: "₹" }[code || "EUR"] || code || "€");

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [interested, setInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(0);

  useEffect(() => {
    ensureCourseDetailsSeed();
    const courses: Course[] = JSON.parse(localStorage.getItem("courses") || "[]");
    const universityCourses: Course[] = JSON.parse(
      localStorage.getItem("universityCourses") || "[]"
    );
    const found =
      courses.find((c) => c.id === courseId) ||
      universityCourses.find((c) => c.id === courseId) ||
      null;
    setCourse(found);

    if (found) {
      const universities: University[] = JSON.parse(
        localStorage.getItem("universities") || "[]"
      );
      setUniversity(
        universities.find((u) => u.id === found.organizationId) || null
      );
      const userKey = getInterestUserKey();
      setInterested(hasUserMarkedInterest(found.id, userKey));
      setInterestCount(getCourseInterestCount(found.id));
    }
  }, [courseId]);

  const userKey = useMemo(() => getInterestUserKey(), []);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  const handleApplyNow = () => {
    const userAuth = localStorage.getItem("userAuth");
    if (!userAuth) {
      navigate("/user/login");
      return;
    }
    navigate(`/user/apply/${(course as any).applicationFormId || "form-1"}`, {
      state: {
        courseId: course.id,
        courseName: course.name,
        universityName: university?.name,
      },
    });
  };

  const handleInterest = () => {
    if (interested) {
      const { count } = unmarkCourseInterest(course.id, userKey);
      setInterested(false);
      setInterestCount(count);
      toast({ title: "Removed", description: "Removed from your interested courses" });
    } else {
      const { added, count } = markCourseInterest(course.id, userKey);
      setInterested(true);
      setInterestCount(count);
      toast({
        title: added ? "Interest recorded" : "Already recorded",
        description: added
          ? "The university can see you're interested in this course"
          : "Your interest was already counted",
      });
    }
  };

  const handleDownloadGuide = () => {
    if (!course.programmeGuideUrl) return;
    const a = document.createElement("a");
    a.href = course.programmeGuideUrl;
    a.download = course.programmeGuideName || "programme-guide.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const location = [course.city, course.country].filter(Boolean).join(", ");
  const feeLabel =
    course.tuitionFee && Number(course.tuitionFee) > 0
      ? `${currencySymbol(course.tuitionCurrency)}${course.tuitionFee}`
      : course.tuitionFee !== undefined && course.tuitionFee !== ""
        ? "No tuition fee"
        : undefined;
  const programmeGroups = resolveProgrammeGroups(course);
  const careerFileIsImage = course.careerSectionFileUrl?.startsWith("data:image/") || /\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(course.careerSectionFileUrl || "");
  const students = (course.testimonials || []).filter((t) => t.kind === "student");
  const faculty = (course.testimonials || []).filter((t) => t.kind === "faculty");

  const testimonialCard = (t: (typeof students)[number]) => (
    <Card key={t.id}>
      <CardContent className="pt-6 space-y-3">
        <Quote className="h-6 w-6 text-primary" />
        <p className="font-medium leading-relaxed">{t.quote}</p>
        <div className="flex items-center gap-3 pt-2">
          {t.portrait ? (
            <img
              src={t.portrait}
              alt={t.name}
              className="h-11 w-11 rounded-full object-cover border"
            />
          ) : (
            <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
        {course.bannerImage && (
          <img
            src={course.bannerImage}
            alt={course.heroAltText || course.name}
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {interestCount} {interestCount === 1 ? "person is" : "people are"} interested
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Badge className="mb-3">{course.shortName}</Badge>
            <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              {university && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-5 w-5" />
                  {university.name}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  {location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Why study {course.name}?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.summary && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {course.summary}
                  </p>
                )}
                {(course.descriptionBlocks?.length
                  ? course.descriptionBlocks
                  : [course.description]
                ).map((block, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {block}
                  </p>
                ))}
                {course.highlightCallout && (
                  <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-4">
                    <p className="font-medium">{course.highlightCallout}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {programmeGroups.some((group) => group.points.some((point) => point.trim()) || group.image) && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Why Study This Programme?</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {programmeGroups.map((group) => <Card key={group.key}>
                    {group.image && <img src={group.image} alt={group.subheader} className="w-full aspect-[4/3] object-cover rounded-t-lg" />}
                    <CardContent className="pt-6 space-y-3">
                      <h3 className="font-semibold text-lg">{group.subheader}</h3>
                      <ul className="space-y-2">{group.points.filter((point) => point.trim()).map((point, index) => <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-primary" /><span className="whitespace-pre-wrap break-words">{point}</span>
                      </li>)}</ul>
                    </CardContent>
                  </Card>)}
                </div>
              </section>
            )}

            {(course.careerPaths?.some((career) => career.role.trim()) || course.careerSectionFileUrl) && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Briefcase className="h-5 w-5" />Career Pathway</h2>
                <ul className="space-y-3">{(course.careerPaths || []).filter((career) => career.role.trim()).map((career) => <li key={career.id} className="flex items-start gap-2"><CheckCircle className="h-5 w-5 text-primary shrink-0" /><span className="font-medium break-words">{career.role}</span></li>)}</ul>
                {course.careerSectionFileUrl && <div className="space-y-3">
                  {careerFileIsImage && <img src={course.careerSectionFileUrl} alt="Career pathway" className="max-h-96 w-full object-contain" />}
                  <Button variant="outline" className="gap-2" onClick={() => {
                    const link = document.createElement('a');
                    link.href = course.careerSectionFileUrl || '';
                    link.download = course.careerSectionFileName || 'career-pathway';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    document.body.appendChild(link); link.click(); link.remove();
                  }}><Download className="h-4 w-4" />{course.careerSectionFileName || 'Career Pathway File'}</Button>
                </div>}
              </section>
            )}

            {/* Programme information accordions */}
            {!!course.infoSections?.length && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Programme information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {course.infoSections.map((s) => (
                      <AccordionItem key={s.id} value={s.id}>
                        <AccordionTrigger>{s.title}</AccordionTrigger>
                        <AccordionContent>
                          <p className="whitespace-pre-wrap text-muted-foreground">
                            {s.content}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* Testimonials */}
            {!!students.length && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Student testimonials</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {students.map(testimonialCard)}
                </div>
              </div>
            )}
            {!!faculty.length && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Faculty testimonials</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {faculty.map(testimonialCard)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duration
                    </span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                )}
                {course.intakePeriod && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Intake
                    </span>
                    <span className="font-medium">{course.intakePeriod}</span>
                  </div>
                )}
                {course.language && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Language
                    </span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                )}
                {course.credits && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Credits
                    </span>
                    <span className="font-medium">{course.credits}</span>
                  </div>
                )}
                {course.studyMode && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Study Mode</span>
                    <span className="font-medium">{course.studyMode}</span>
                  </div>
                )}
                {feeLabel && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tuition Fee</span>
                    <span className="font-medium text-primary">{feeLabel}</span>
                  </div>
                )}
                {course.scholarshipAvailable && (
                  <Badge variant="secondary">Scholarships available</Badge>
                )}
              </CardContent>
            </Card>

            {/* Quick facts */}
            {!!course.quickFacts?.length && (
              <Card>
                <CardContent className="pt-6 grid grid-cols-2 gap-4">
                  {course.quickFacts.map((f) => (
                    <div key={f.id}>
                      <p className="text-xs text-muted-foreground">{f.label}</p>
                      <p className="font-semibold">{f.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Apply Card */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Plan your application</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.applicationDeadline && (
                  <div className="text-sm text-muted-foreground">
                    Apply before
                    <span className="block font-medium text-foreground">
                      {new Date(course.applicationDeadline).toLocaleDateString(
                        undefined,
                        { day: "2-digit", month: "long", year: "numeric" }
                      )}
                    </span>
                  </div>
                )}
                {course.applicationStatus === "closed" ? (
                  <Badge variant="outline">Applications closed</Badge>
                ) : (
                  <Button size="lg" className="w-full" onClick={handleApplyNow}>
                    Apply Now
                  </Button>
                )}
                <Button
                  variant={interested ? "secondary" : "outline"}
                  className="w-full gap-2"
                  onClick={handleInterest}
                >
                  <Heart
                    className={`h-4 w-4 ${interested ? "fill-current" : ""}`}
                  />
                  {interested ? "Interested ✓" : "I am interested in this course"}
                </Button>
                {course.programmeGuideUrl && (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleDownloadGuide}
                  >
                    <Download className="h-4 w-4" />
                    Download Programme Guide
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/user/courses")}
                >
                  Back to Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
