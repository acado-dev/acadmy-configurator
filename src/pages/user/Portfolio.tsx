import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { usePortfolio } from "@/hooks/usePortfolio";
import { 
  Linkedin, 
  Github, 
  Twitter, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  BookOpen,
  Heart,
  Languages,
  Edit,
  Trash2,
  Plus,
  Share2,
  Download,
  MoreVertical,
  User,
  FolderOpen,
  FileText,
  Users,
  PenTool,
  ChevronRight,
  Building,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import AddProfileSectionDialog from "@/components/portfolio/AddProfileSectionDialog";
import EditExperienceDialog from "@/components/portfolio/EditExperienceDialog";
import EditEducationDialog from "@/components/portfolio/EditEducationDialog";
import EditProjectDialog from "@/components/portfolio/EditProjectDialog";
import EditSkillDialog from "@/components/portfolio/EditSkillDialog";
import EditCertificationDialog from "@/components/portfolio/EditCertificationDialog";
import EditPublicationDialog from "@/components/portfolio/EditPublicationDialog";
import EditVolunteeringDialog from "@/components/portfolio/EditVolunteeringDialog";
import EditLanguageDialog from "@/components/portfolio/EditLanguageDialog";
import EditAboutDialog from "@/components/portfolio/EditAboutDialog";
import { Experience, Education, Project, Skill, Certification, Publication, Volunteering, Language } from "@/types/portfolio";
import { toast } from "sonner";

type Section = 'about' | 'experience' | 'education' | 'projects' | 'skills' | 'certifications' | 'publications' | 'volunteering' | 'languages';

const Portfolio = () => {
  const { 
    portfolio, 
    updateAbout,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addCertification,
    updateCertification,
    deleteCertification,
    addPublication,
    updatePublication,
    deletePublication,
    addVolunteering,
    updateVolunteering,
    deleteVolunteering,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    exportPortfolio 
  } = usePortfolio();

  const [activeSection, setActiveSection] = useState<Section>('about');
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [editingVolunteering, setEditingVolunteering] = useState<Volunteering | null>(null);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [editingAbout, setEditingAbout] = useState(false);

  const handleExportResume = () => {
    exportPortfolio();
    toast.success("Portfolio exported successfully!");
  };

  const handleShareProfile = async () => {
    // Generate username from email or use firstName-lastName
    const username = portfolio.email?.split('@')[0] || 
                    `${portfolio.firstName}-${portfolio.lastName}`.toLowerCase().replace(/\s+/g, '-');
    const profileUrl = `${window.location.origin}/profile/${username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${portfolio.firstName} ${portfolio.lastName}'s Portfolio`,
          text: 'Check out my professional portfolio',
          url: profileUrl
        });
        toast.success('Profile shared successfully!');
      } catch (error) {
        // User cancelled share or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          // Fallback to clipboard
          navigator.clipboard.writeText(profileUrl);
          toast.success('Public profile link copied to clipboard!');
        }
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(profileUrl);
      toast.success('Public profile link copied to clipboard!');
    }
  };

  const handleViewPublicProfile = () => {
    const username = portfolio.email?.split('@')[0] || 
                    `${portfolio.firstName}-${portfolio.lastName}`.toLowerCase().replace(/\s+/g, '-');
    const profileUrl = `/profile/${username}`;
    window.open(profileUrl, '_blank');
  };

  const getInitials = () => {
    const firstInitial = portfolio.firstName?.[0] || '';
    const lastInitial = portfolio.lastName?.[0] || '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  const navigationItems = [
    { id: 'about', label: 'About', icon: User, count: portfolio.about ? 1 : 0 },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: portfolio.experience.length },
    { id: 'education', label: 'Education', icon: GraduationCap, count: portfolio.education.length },
    { id: 'projects', label: 'Projects', icon: FolderOpen, count: portfolio.projects.length },
    { id: 'skills', label: 'Skills', icon: Code, count: portfolio.skills.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: portfolio.certifications.length },
    { id: 'publications', label: 'Publications', icon: BookOpen, count: portfolio.publications.length },
    { id: 'volunteering', label: 'Volunteering', icon: Heart, count: portfolio.volunteering.length },
    { id: 'languages', label: 'Languages', icon: Languages, count: portfolio.languages.length },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                About Me
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingAbout(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
            
            <Card className="hover-scale">
              <CardContent className="pt-6">
                {portfolio.about ? (
                  <p className="text-muted-foreground leading-relaxed">{portfolio.about}</p>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No about section added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setEditingAbout(true)}
                    >
                      Add About
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="hover-scale">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {portfolio.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{portfolio.email}</span>
                  </div>
                )}
                {portfolio.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{portfolio.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                Work Experience
              </h2>
              <Button
                size="sm"
                onClick={() => setEditingExperience({
                  id: '',
                  title: '',
                  company: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: ''
                })}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
            </div>

            {portfolio.experience.length > 0 ? (
              <div className="space-y-4">
                {portfolio.experience.map((exp, index) => (
                  <Card key={exp.id} className="hover-scale animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{exp.title}</h4>
                            <p className="text-primary font-medium">{exp.company}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {exp.location}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingExperience(exp)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                deleteExperience(exp.id);
                                toast.success("Experience deleted");
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No experience added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setEditingExperience({
                        id: '',
                        title: '',
                        company: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                        description: ''
                      })}
                    >
                      Add Your First Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                Education
              </h2>
              <Button
                size="sm"
                onClick={() => setEditingEducation({
                  id: '',
                  degree: '',
                  institution: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  grade: '',
                  description: ''
                })}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
            </div>

            {portfolio.education.length > 0 ? (
              <div className="space-y-4">
                {portfolio.education.map((edu, index) => (
                  <Card key={edu.id} className="hover-scale animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{edu.degree}</h4>
                            <p className="text-primary font-medium">{edu.institution}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {edu.startDate} - {edu.endDate}
                              </span>
                              {edu.grade && (
                                <Badge variant="secondary">{edu.grade}</Badge>
                              )}
                            </div>
                            {edu.description && (
                              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{edu.description}</p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingEducation(edu)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                deleteEducation(edu.id);
                                toast.success("Education deleted");
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No education added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setEditingEducation({
                        id: '',
                        degree: '',
                        institution: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        grade: '',
                        description: ''
                      })}
                    >
                      Add Your Education
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-primary" />
                Projects
              </h2>
              <Button
                size="sm"
                onClick={() => setEditingProject({
                  id: '',
                  title: '',
                  description: '',
                  technologies: [],
                  link: '',
                  startDate: '',
                  endDate: ''
                })}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </div>

            {portfolio.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.projects.map((project, index) => (
                  <Card key={project.id} className="hover-scale animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-lg">{project.title}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingProject(project)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                deleteProject(project.id);
                                toast.success("Project deleted");
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        {project.link && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-3 w-3 mr-1" />
                              Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No projects added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                        onClick={() => setEditingProject({
                          id: '',
                          title: '',
                          description: '',
                          technologies: [],
                          link: '',
                          startDate: '',
                          endDate: ''
                        })}
                    >
                      Add Your First Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Code className="h-6 w-6 text-primary" />
                Skills
              </h2>
              <Button
                size="sm"
                onClick={() => setEditingSkill({ id: '', name: '', level: 'intermediate', category: '' })}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            </div>

            {portfolio.skills.length > 0 ? (
              <Card className="hover-scale">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills.map((skill) => (
                      <Badge 
                        key={skill.id} 
                        variant="secondary"
                        className="px-3 py-1.5 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => setEditingSkill(skill)}
                      >
                        {skill.name}
                        {skill.level && (
                          <span className="ml-2 opacity-60">• {skill.level}</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Code className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No skills added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setEditingSkill({ id: '', name: '', level: 'intermediate', category: '' })}
                    >
                      Add Your Skills
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                Certifications
              </h2>
              <Button
                size="sm"
                onClick={() => setEditingCertification({
                  id: '',
                  name: '',
                  issuer: '',
                  issueDate: '',
                  expiryDate: '',
                  credentialId: '',
                  credentialUrl: ''
                })}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Certification
              </Button>
            </div>

            {portfolio.certifications.length > 0 ? (
              <div className="space-y-4">
                {portfolio.certifications.map((cert, index) => (
                  <Card key={cert.id} className="hover-scale animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Award className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{cert.name}</h4>
                            <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Issued {cert.issueDate}
                              {cert.expiryDate && ` • Expires ${cert.expiryDate}`}
                            </p>
                            {cert.credentialUrl && (
                              <Button size="sm" variant="link" className="px-0 mt-2" asChild>
                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                                  View Credential
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingCertification(cert)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                deleteCertification(cert.id);
                                toast.success("Certification deleted");
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No certifications added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                        onClick={() => setEditingCertification({
                          id: '',
                          name: '',
                          issuer: '',
                          issueDate: '',
                          expiryDate: '',
                          credentialId: '',
                          credentialUrl: ''
                        })}
                    >
                      Add Your First Certification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'publications':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                Publications
              </h2>
              <Button
                size="sm"
                onClick={() => setEditingPublication({
                  id: '',
                  title: '',
                  publisher: '',
                  publicationDate: '',
                  authors: [],
                  description: '',
                  link: ''
                })}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Publication
              </Button>
            </div>

            {portfolio.publications.length > 0 ? (
              <div className="space-y-4">
                {portfolio.publications.map((pub, index) => (
                  <Card key={pub.id} className="hover-scale animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{pub.title}</h4>
                          <p className="text-sm text-muted-foreground">{pub.publisher} • {pub.publicationDate}</p>
                          {pub.description && (
                            <p className="mt-2 text-sm text-muted-foreground">{pub.description}</p>
                          )}
                          {pub.link && (
                            <Button size="sm" variant="link" className="px-0 mt-2" asChild>
                              <a href={pub.link} target="_blank" rel="noopener noreferrer">
                                Read Publication
                              </a>
                            </Button>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingPublication(pub)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                deletePublication(pub.id);
                                toast.success("Publication deleted");
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No publications added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                        onClick={() => setEditingPublication({
                          id: '',
                          title: '',
                          publisher: '',
                          publicationDate: '',
                          authors: [],
                          description: '',
                          link: ''
                        })}
                    >
                      Add Your First Publication
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'volunteering':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Volunteering
              </h2>
              <Button
                size="sm"
                onClick={() => setEditingVolunteering({
                  id: '',
                  role: '',
                  organization: '',
                  cause: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: ''
                })}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Volunteering
              </Button>
            </div>

            {portfolio.volunteering.length > 0 ? (
              <div className="space-y-4">
                {portfolio.volunteering.map((vol, index) => (
                  <Card key={vol.id} className="hover-scale animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Heart className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{vol.role}</h4>
                            <p className="text-sm text-primary font-medium">{vol.organization}</p>
                            {vol.cause && (
                              <Badge variant="outline" className="mt-1">{vol.cause}</Badge>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {vol.startDate} - {vol.current ? 'Present' : vol.endDate}
                            </p>
                            {vol.description && (
                              <p className="mt-3 text-sm text-muted-foreground">{vol.description}</p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingVolunteering(vol)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                deleteVolunteering(vol.id);
                                toast.success("Volunteering deleted");
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No volunteering experience added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setEditingVolunteering({
                        id: '',
                        role: '',
                        organization: '',
                        cause: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                        description: ''
                      })}
                    >
                      Add Volunteering Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'languages':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Languages className="h-6 w-6 text-primary" />
                Languages
              </h2>
              <Button
                size="sm"
                onClick={() => setEditingLanguage({ id: '', name: '', proficiency: 'conversational' })}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Language
              </Button>
            </div>

            {portfolio.languages.length > 0 ? (
              <Card className="hover-scale">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {portfolio.languages.map((language) => (
                      <div 
                        key={language.id} 
                        className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setEditingLanguage(language)}
                      >
                        <span className="font-medium">{language.name}</span>
                        <Badge variant="secondary">
                          {language.proficiency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <Languages className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No languages added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setEditingLanguage({ id: '', name: '', proficiency: 'conversational' })}
                    >
                      Add Languages You Speak
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={portfolio.profileImage} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold">
                  {portfolio.firstName || portfolio.lastName 
                    ? `${portfolio.firstName} ${portfolio.lastName}` 
                    : 'Your Portfolio'}
                </h1>
                <p className="text-sm text-muted-foreground">{portfolio.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsAddSectionOpen(true)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportResume} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleViewPublicProfile} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                View Public
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareProfile} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Card className="sticky top-20">
              <CardContent className="p-3">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as Section)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.count > 0 && (
                            <Badge 
                              variant={isActive ? "secondary" : "outline"} 
                              className={cn(
                                "text-xs px-1.5 min-w-[20px] justify-center",
                                isActive && "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                              )}
                            >
                              {item.count}
                            </Badge>
                          )}
                          <ChevronRight className={cn(
                            "h-3 w-3 transition-opacity",
                            isActive ? "opacity-100" : "opacity-0"
                          )} />
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <Separator className="my-4" />

                {/* Social Links */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground px-3">Social Links</p>
                  <div className="flex justify-center gap-1">
                    {portfolio.socialLinks?.linkedin && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {portfolio.socialLinks?.github && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {portfolio.socialLinks?.twitter && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {portfolio.socialLinks?.portfolio && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={portfolio.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <ScrollArea className="h-[calc(100vh-120px)]">
              {renderSectionContent()}
            </ScrollArea>
          </main>
        </div>
      </div>

      {/* Dialogs */}
      <AddProfileSectionDialog 
        open={isAddSectionOpen}
        onOpenChange={setIsAddSectionOpen}
        onAddSection={(section) => { setActiveSection(section as Section); setIsAddSectionOpen(false); }}
      />

      {editingAbout && (
        <EditAboutDialog
          open={editingAbout}
          onOpenChange={setEditingAbout}
          about={portfolio.about}
          onSave={updateAbout}
        />
      )}

      {editingExperience && (
        <EditExperienceDialog
          open={!!editingExperience}
          onOpenChange={(open) => !open && setEditingExperience(null)}
          experience={editingExperience}
          onSave={(experience) => {
            if (editingExperience && editingExperience.id) {
              updateExperience(editingExperience.id, experience);
              toast.success("Experience updated");
            } else {
              addExperience(experience);
              toast.success("Experience added");
            }
            setEditingExperience(null);
          }}
        />
      )}

      {editingEducation && (
        <EditEducationDialog
          open={!!editingEducation}
          onOpenChange={(open) => !open && setEditingEducation(null)}
          education={editingEducation}
          onSave={(education) => {
            if (editingEducation && editingEducation.id) {
              updateEducation(editingEducation.id, education);
              toast.success("Education updated");
            } else {
              addEducation(education);
              toast.success("Education added");
            }
            setEditingEducation(null);
          }}
        />
      )}

      {editingProject && (
        <EditProjectDialog
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
          project={editingProject}
          onSave={(project) => {
            if (editingProject && editingProject.id) {
              updateProject(editingProject.id, project);
              toast.success("Project updated");
            } else {
              addProject(project);
              toast.success("Project added");
            }
            setEditingProject(null);
          }}
        />
      )}

      {editingSkill && (
        <EditSkillDialog
          open={!!editingSkill}
          onOpenChange={(open) => !open && setEditingSkill(null)}
          skill={editingSkill}
          onSave={(skill) => {
            if (editingSkill && editingSkill.id) {
              updateSkill(editingSkill.id, skill);
              toast.success("Skill updated");
            } else {
              addSkill(skill);
              toast.success("Skill added");
            }
            setEditingSkill(null);
          }}
          onDelete={() => {
            if (editingSkill?.id) {
              deleteSkill(editingSkill.id);
              toast.success("Skill deleted");
              setEditingSkill(null);
            }
          }}
        />
      )}

      {editingCertification && (
        <EditCertificationDialog
          open={!!editingCertification}
          onOpenChange={(open) => !open && setEditingCertification(null)}
          certification={editingCertification}
          onSave={(certification) => {
            if (editingCertification && editingCertification.id) {
              updateCertification(editingCertification.id, certification);
              toast.success("Certification updated");
            } else {
              addCertification(certification);
              toast.success("Certification added");
            }
            setEditingCertification(null);
          }}
        />
      )}

      {editingPublication && (
        <EditPublicationDialog
          open={!!editingPublication}
          onOpenChange={(open) => !open && setEditingPublication(null)}
          publication={editingPublication}
          onSave={(publication) => {
            if (editingPublication && editingPublication.id) {
              updatePublication(editingPublication.id, publication);
              toast.success("Publication updated");
            } else {
              addPublication(publication);
              toast.success("Publication added");
            }
            setEditingPublication(null);
          }}
        />
      )}

      {editingVolunteering && (
        <EditVolunteeringDialog
          open={!!editingVolunteering}
          onOpenChange={(open) => !open && setEditingVolunteering(null)}
          volunteering={editingVolunteering}
          onSave={(volunteering) => {
            if (editingVolunteering && editingVolunteering.id) {
              updateVolunteering(editingVolunteering.id, volunteering);
              toast.success("Volunteering updated");
            } else {
              addVolunteering(volunteering);
              toast.success("Volunteering added");
            }
            setEditingVolunteering(null);
          }}
        />
      )}

      {editingLanguage && (
        <EditLanguageDialog
          open={!!editingLanguage}
          onOpenChange={(open) => !open && setEditingLanguage(null)}
          language={editingLanguage}
          onSave={(language) => {
            if (editingLanguage && editingLanguage.id) {
              updateLanguage(editingLanguage.id, language);
              toast.success("Language updated");
            } else {
              addLanguage(language);
              toast.success("Language added");
            }
            setEditingLanguage(null);
          }}
          onDelete={() => {
            if (editingLanguage?.id) {
              deleteLanguage(editingLanguage.id);
              toast.success("Language deleted");
              setEditingLanguage(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default Portfolio;