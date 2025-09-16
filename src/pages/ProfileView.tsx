import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  MapPin, Mail, Phone, Globe, Linkedin, Github, Twitter,
  Briefcase, GraduationCap, Code2, Award, BookOpen, Heart,
  Languages, Calendar, ExternalLink, Share2, Download, QrCode,
  ChevronRight, Star, Clock, Users, Link2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Portfolio } from '@/types/portfolio';

const samplePortfolio: Portfolio = {
  id: '1',
  userId: 'user123',
  firstName: 'Sarah',
  lastName: 'Anderson',
  email: 'sarah.anderson@example.com',
  phone: '+1 (555) 123-4567',
  about: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. I specialize in React, Node.js, and cloud architecture. When I\'m not coding, you\'ll find me contributing to open-source projects or mentoring junior developers. I believe in writing clean, maintainable code and creating user experiences that delight.',
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/sarahanderson',
    github: 'https://github.com/sarahanderson',
    twitter: 'https://twitter.com/sarahcodes',
    portfolio: 'https://sarahanderson.dev'
  },
  experience: [
    {
      id: '1',
      title: 'Senior Full-Stack Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Leading development of cloud-native applications using React, Node.js, and AWS. Mentoring junior developers and conducting code reviews. Improved application performance by 40% through optimization strategies.'
    },
    {
      id: '2',
      title: 'Full-Stack Developer',
      company: 'Digital Innovations Inc.',
      location: 'New York, NY',
      startDate: '2019-06',
      endDate: '2021-02',
      current: false,
      description: 'Developed and maintained multiple client-facing web applications. Collaborated with design team to implement responsive UI/UX. Integrated third-party APIs and payment gateways.'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startDate: '2017-09',
      endDate: '2019-05',
      grade: '3.9/4.0 GPA',
      description: 'Specialized in Machine Learning and Distributed Systems. Thesis on "Optimizing Neural Network Training in Distributed Environments".'
    },
    {
      id: '2',
      degree: 'Bachelor of Science in Software Engineering',
      institution: 'UC Berkeley',
      location: 'Berkeley, CA',
      startDate: '2013-09',
      endDate: '2017-05',
      grade: '3.8/4.0 GPA',
      description: 'Dean\'s List all semesters. President of Women in Tech club.'
    }
  ],
  projects: [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Built a scalable e-commerce platform handling 10K+ daily transactions. Implemented real-time inventory management and AI-powered product recommendations.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Redis', 'AWS'],
      link: 'https://github.com/sarahanderson/ecommerce-platform',
      startDate: '2023-01',
      endDate: '2023-06'
    },
    {
      id: '2',
      title: 'Real-Time Collaboration Tool',
      description: 'Developed a Figma-like collaborative design tool with real-time synchronization using WebSockets and CRDT algorithms.',
      technologies: ['Vue.js', 'Socket.io', 'PostgreSQL', 'Docker'],
      link: 'https://collab-tool.demo.com',
      startDate: '2022-08',
      endDate: '2022-12'
    }
  ],
  skills: [
    { id: '1', name: 'JavaScript', level: 'expert', category: 'Programming' },
    { id: '2', name: 'TypeScript', level: 'expert', category: 'Programming' },
    { id: '3', name: 'React', level: 'expert', category: 'Frontend' },
    { id: '4', name: 'Node.js', level: 'advanced', category: 'Backend' },
    { id: '5', name: 'AWS', level: 'advanced', category: 'Cloud' },
    { id: '6', name: 'Docker', level: 'intermediate', category: 'DevOps' },
    { id: '7', name: 'GraphQL', level: 'advanced', category: 'API' },
    { id: '8', name: 'MongoDB', level: 'advanced', category: 'Database' }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2022-03',
      expiryDate: '2025-03',
      credentialId: 'AWS-SA-2022-001234',
      credentialUrl: 'https://aws.amazon.com/verify/001234'
    },
    {
      id: '2',
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      issueDate: '2021-11',
      expiryDate: '2023-11',
      credentialId: 'GCP-PD-2021-005678',
      credentialUrl: 'https://cloud.google.com/verify/005678'
    }
  ],
  publications: [
    {
      id: '1',
      title: 'Optimizing React Performance in Large-Scale Applications',
      publisher: 'Medium Engineering',
      publicationDate: '2023-02',
      authors: ['Sarah Anderson', 'John Doe'],
      link: 'https://medium.com/engineering/react-optimization',
      description: 'A comprehensive guide to performance optimization techniques for React applications handling millions of users.'
    }
  ],
  volunteering: [
    {
      id: '1',
      role: 'Coding Instructor',
      organization: 'Code for Kids',
      cause: 'Education',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: 'Teaching programming fundamentals to underprivileged children aged 10-16. Developed curriculum for Python and web development courses.'
    }
  ],
  languages: [
    { id: '1', name: 'English', proficiency: 'native' },
    { id: '2', name: 'Spanish', proficiency: 'professional' },
    { id: '3', name: 'Mandarin', proficiency: 'conversational' }
  ],
  resumes: [],
  createdAt: '2023-01-01',
  updatedAt: '2024-01-15'
};

const ProfileView = () => {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState<Portfolio>(samplePortfolio);
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const profileUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${portfolio.firstName} ${portfolio.lastName}'s Profile`,
          text: `Check out ${portfolio.firstName}'s professional profile`,
          url: profileUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard!');
    }
  };

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${portfolio.firstName} ${portfolio.lastName}
EMAIL:${portfolio.email}
TEL:${portfolio.phone}
URL:${portfolio.socialLinks.portfolio || profileUrl}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolio.firstName}_${portfolio.lastName}.vcf`;
    a.click();
  };

  const getSkillLevel = (level: string) => {
    switch (level) {
      case 'beginner': return 25;
      case 'intermediate': return 50;
      case 'advanced': return 75;
      case 'expert': return 100;
      default: return 0;
    }
  };

  const getLanguageProficiency = (proficiency: string) => {
    switch (proficiency) {
      case 'basic': return 25;
      case 'conversational': return 50;
      case 'professional': return 75;
      case 'native': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={portfolio.profileImage} />
                <AvatarFallback>
                  {portfolio.firstName[0]}{portfolio.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold">
                {portfolio.firstName} {portfolio.lastName}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQRCode(true)}
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                onClick={handleDownloadVCard}
              >
                <Download className="h-4 w-4 mr-2" />
                Save Contact
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-start gap-6">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                      <AvatarImage src={portfolio.profileImage} />
                      <AvatarFallback className="text-2xl">
                        {portfolio.firstName[0]}{portfolio.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-2">
                        {portfolio.firstName} {portfolio.lastName}
                      </h1>
                      <p className="text-muted-foreground mb-4">
                        {portfolio.experience[0]?.title} at {portfolio.experience[0]?.company}
                      </p>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <Badge variant="secondary" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {portfolio.experience[0]?.location}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Mail className="h-3 w-3" />
                          {portfolio.email}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Phone className="h-3 w-3" />
                          {portfolio.phone}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {portfolio.socialLinks.linkedin && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {portfolio.socialLinks.github && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer">
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {portfolio.socialLinks.twitter && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {portfolio.socialLinks.portfolio && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={portfolio.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Card className="bg-background/50 backdrop-blur">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Experience</span>
                        <span className="text-xl font-bold">5+ years</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </CardContent>
                  </Card>
                  <Card className="bg-background/50 backdrop-blur">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Projects</span>
                        <span className="text-xl font-bold">{portfolio.projects.length}</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {portfolio.about}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Experience Timeline */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Recent Experience
                  </h3>
                  <div className="space-y-4">
                    {portfolio.experience.slice(0, 2).map((exp, index) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground mb-1">{exp.company}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {exp.location}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Education
                  </h3>
                  <div className="space-y-4">
                    {portfolio.education.map((edu, index) => (
                      <motion.div
                        key={edu.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 rounded-lg bg-muted/30"
                      >
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{edu.startDate} - {edu.endDate}</span>
                          {edu.grade && <Badge variant="secondary">{edu.grade}</Badge>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              {portfolio.certifications.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Certifications
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {portfolio.certifications.map((cert) => (
                        <motion.div
                          key={cert.id}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-lg border bg-card hover:shadow-lg transition-all"
                        >
                          <h4 className="font-semibold text-sm">{cert.name}</h4>
                          <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              Issued {cert.issueDate}
                            </span>
                            {cert.credentialUrl && (
                              <Button size="sm" variant="ghost" asChild>
                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              {portfolio.experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{exp.title}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                        {exp.current && (
                          <Badge className="bg-green-500/10 text-green-600">Current</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exp.location}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              {portfolio.projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        {project.link && (
                          <Button size="sm" variant="ghost" asChild>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              <Link2 className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {project.startDate} - {project.endDate}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              {/* Skills by Category */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
                  <div className="space-y-6">
                    {Object.entries(
                      portfolio.skills.reduce((acc, skill) => {
                        if (!acc[skill.category]) acc[skill.category] = [];
                        acc[skill.category].push(skill);
                        return acc;
                      }, {} as Record<string, typeof portfolio.skills>)
                    ).map(([category, skills]) => (
                      <div key={category}>
                        <h4 className="font-medium mb-3">{category}</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {skills.map((skill) => (
                            <div key={skill.id} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{skill.name}</span>
                                <span className="text-muted-foreground capitalize">{skill.level}</span>
                              </div>
                              <Progress value={getSkillLevel(skill.level)} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Languages
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {portfolio.languages.map((language) => (
                      <div key={language.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{language.name}</span>
                          <span className="text-muted-foreground capitalize">{language.proficiency}</span>
                        </div>
                        <Progress value={getLanguageProficiency(language.proficiency)} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Profile via QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to view the profile on another device
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={profileUrl} size={200} />
            </div>
            <p className="text-sm text-muted-foreground text-center break-all">
              {profileUrl}
            </p>
            <Button onClick={handleShare} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileView;