import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from '@/hooks/use-toast';

interface CourseCampaign {
  courseId: string;
  modeOfDelivery?: string;
  aboutCourse?: string;
  whatWillYouGet?: string;
  brochure?: string;
  eligibility?: string;
  fieldOfStudy?: string;
  duration?: string;
  noOfPeopleRated?: string;
  rating?: string;
  department?: string;
  tuitionFee?: string;
  credits?: string;
  maximumSeats?: string;
  availableSeats?: string;
  preRequisites?: string;
  classSlots?: string;
  language?: string;
  scholarship?: string;
  howToApply?: string;
  courseStructure?: string;
  learningOutcome?: string;
  partners?: string;
  collaboration?: string;
  careerOpportunities?: string;
  courseUSP?: string;
}

const CourseCampaign = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [courseName, setCourseName] = useState('');

  // Form state
  const [modeOfDelivery, setModeOfDelivery] = useState('');
  const [aboutCourse, setAboutCourse] = useState('');
  const [whatWillYouGet, setWhatWillYouGet] = useState('');
  const [brochure, setBrochure] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [duration, setDuration] = useState('');
  const [noOfPeopleRated, setNoOfPeopleRated] = useState('');
  const [rating, setRating] = useState('');
  const [department, setDepartment] = useState('');
  const [tuitionFee, setTuitionFee] = useState('');
  const [credits, setCredits] = useState('');
  const [maximumSeats, setMaximumSeats] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [preRequisites, setPreRequisites] = useState('');
  const [classSlots, setClassSlots] = useState('');
  const [language, setLanguage] = useState('');
  const [scholarship, setScholarship] = useState('');
  const [howToApply, setHowToApply] = useState('');
  const [courseStructure, setCourseStructure] = useState('');
  const [learningOutcome, setLearningOutcome] = useState('');
  const [partners, setPartners] = useState('');
  const [collaboration, setCollaboration] = useState('');
  const [careerOpportunities, setCareerOpportunities] = useState('');
  const [courseUSP, setCourseUSP] = useState('');

  useEffect(() => {
    if (courseId) {
      loadCampaignData();
      loadCourseName();
    }
  }, [courseId]);

  const loadCourseName = () => {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const universityCourses = JSON.parse(localStorage.getItem('universityCourses') || '[]');
    const allCourses = [...courses, ...universityCourses];
    const course = allCourses.find((c: any) => c.id === courseId);
    if (course) {
      setCourseName(course.name);
    }
  };

  const loadCampaignData = () => {
    const campaigns = JSON.parse(localStorage.getItem('courseCampaigns') || '[]');
    const campaign = campaigns.find((c: CourseCampaign) => c.courseId === courseId);
    
    if (campaign) {
      setModeOfDelivery(campaign.modeOfDelivery || '');
      setAboutCourse(campaign.aboutCourse || '');
      setWhatWillYouGet(campaign.whatWillYouGet || '');
      setBrochure(campaign.brochure || '');
      setEligibility(campaign.eligibility || '');
      setFieldOfStudy(campaign.fieldOfStudy || '');
      setDuration(campaign.duration || '');
      setNoOfPeopleRated(campaign.noOfPeopleRated || '');
      setRating(campaign.rating || '');
      setDepartment(campaign.department || '');
      setTuitionFee(campaign.tuitionFee || '');
      setCredits(campaign.credits || '');
      setMaximumSeats(campaign.maximumSeats || '');
      setAvailableSeats(campaign.availableSeats || '');
      setPreRequisites(campaign.preRequisites || '');
      setClassSlots(campaign.classSlots || '');
      setLanguage(campaign.language || '');
      setScholarship(campaign.scholarship || '');
      setHowToApply(campaign.howToApply || '');
      setCourseStructure(campaign.courseStructure || '');
      setLearningOutcome(campaign.learningOutcome || '');
      setPartners(campaign.partners || '');
      setCollaboration(campaign.collaboration || '');
      setCareerOpportunities(campaign.careerOpportunities || '');
      setCourseUSP(campaign.courseUSP || '');
    }
  };

  const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrochure(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const campaigns = JSON.parse(localStorage.getItem('courseCampaigns') || '[]');
    const existingIndex = campaigns.findIndex((c: CourseCampaign) => c.courseId === courseId);

    const campaignData: CourseCampaign = {
      courseId: courseId!,
      modeOfDelivery,
      aboutCourse,
      whatWillYouGet,
      brochure,
      eligibility,
      fieldOfStudy,
      duration,
      noOfPeopleRated,
      rating,
      department,
      tuitionFee,
      credits,
      maximumSeats,
      availableSeats,
      preRequisites,
      classSlots,
      language,
      scholarship,
      howToApply,
      courseStructure,
      learningOutcome,
      partners,
      collaboration,
      careerOpportunities,
      courseUSP,
    };

    if (existingIndex !== -1) {
      campaigns[existingIndex] = campaignData;
    } else {
      campaigns.push(campaignData);
    }

    localStorage.setItem('courseCampaigns', JSON.stringify(campaigns));
    
    toast({
      title: 'Success',
      description: 'Course campaign saved successfully',
    });
    
    setLoading(false);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Course Campaign</h1>
        <p className="text-muted-foreground mt-1">{courseName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="modeOfDelivery">Mode of Delivery</Label>
              <Select value={modeOfDelivery} onValueChange={setModeOfDelivery}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="self-paced">Self-Paced</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="offline-incampus">Offline - In Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 6 months, 2 years"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="e.g., English, Spanish"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="e.g., 120"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ratings & Capacity</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="e.g., 4.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="noOfPeopleRated">No of People Rated</Label>
              <Input
                id="noOfPeopleRated"
                value={noOfPeopleRated}
                onChange={(e) => setNoOfPeopleRated(e.target.value)}
                placeholder="e.g., 1250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maximumSeats">Maximum Seats</Label>
              <Input
                id="maximumSeats"
                value={maximumSeats}
                onChange={(e) => setMaximumSeats(e.target.value)}
                placeholder="e.g., 100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableSeats">Available Seats</Label>
              <Input
                id="availableSeats"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
                placeholder="e.g., 45"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tuitionFee">Tuition Fee</Label>
              <Input
                id="tuitionFee"
                value={tuitionFee}
                onChange={(e) => setTuitionFee(e.target.value)}
                placeholder="e.g., $15,000"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Brochure</h2>
          <div className="space-y-2">
            <Label htmlFor="brochure">Upload Brochure (PDF)</Label>
            <Input
              id="brochure"
              type="file"
              accept=".pdf"
              onChange={handleBrochureUpload}
            />
            {brochure && (
              <p className="text-sm text-muted-foreground">Brochure uploaded ✓</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Course Description</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>About Course</Label>
              <ReactQuill
                theme="snow"
                value={aboutCourse}
                onChange={setAboutCourse}
                modules={quillModules}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>What Will You Get?</Label>
              <ReactQuill
                theme="snow"
                value={whatWillYouGet}
                onChange={setWhatWillYouGet}
                modules={quillModules}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Course USP</Label>
              <ReactQuill
                theme="snow"
                value={courseUSP}
                onChange={setCourseUSP}
                modules={quillModules}
                className="bg-background"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Academic Details</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <ReactQuill
                theme="snow"
                value={fieldOfStudy}
                onChange={setFieldOfStudy}
                modules={quillModules}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <ReactQuill
                theme="snow"
                value={department}
                onChange={setDepartment}
                modules={quillModules}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Course Structure</Label>
              <ReactQuill
                theme="snow"
                value={courseStructure}
                onChange={setCourseStructure}
                modules={quillModules}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Learning Outcome</Label>
              <ReactQuill
                theme="snow"
                value={learningOutcome}
                onChange={setLearningOutcome}
                modules={quillModules}
                className="bg-background"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Requirements & Eligibility</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Eligibility</Label>
              <ReactQuill
                theme="snow"
                value={eligibility}
                onChange={setEligibility}
                modules={quillModules}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Pre-requisites</Label>
              <ReactQuill
                theme="snow"
                value={preRequisites}
                onChange={setPreRequisites}
                modules={quillModules}
                className="bg-background"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Schedule & Application</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Class Slots</Label>
              <ReactQuill
                theme="snow"
                value={classSlots}
                onChange={setClassSlots}
                modules={quillModules}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>How to Apply</Label>
              <ReactQuill
                theme="snow"
                value={howToApply}
                onChange={setHowToApply}
                modules={quillModules}
                className="bg-background"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Support</h2>
          <div className="space-y-2">
            <Label>Scholarship</Label>
            <ReactQuill
              theme="snow"
              value={scholarship}
              onChange={setScholarship}
              modules={quillModules}
              className="bg-background"
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Partnerships & Opportunities</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Partners</Label>
              <ReactQuill
                theme="snow"
                value={partners}
                onChange={setPartners}
                modules={quillModules}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Collaboration</Label>
              <ReactQuill
                theme="snow"
                value={collaboration}
                onChange={setCollaboration}
                modules={quillModules}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label>Career Opportunities</Label>
              <ReactQuill
                theme="snow"
                value={careerOpportunities}
                onChange={setCareerOpportunities}
                modules={quillModules}
                className="bg-background"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Campaign'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseCampaign;
