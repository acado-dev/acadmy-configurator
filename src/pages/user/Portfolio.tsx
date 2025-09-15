import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const handleShareProfile = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  const getInitials = () => {
    const firstInitial = portfolio.firstName?.[0] || '';
    const lastInitial = portfolio.lastName?.[0] || '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header with Profile Banner */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 relative">
          <div className="absolute inset-0 bg-grid-white/10 bg-grid-pattern" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src={portfolio.profileImage} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {portfolio.firstName || portfolio.lastName 
                  ? `${portfolio.firstName} ${portfolio.lastName}` 
                  : 'Your Name'}
              </h1>
              <p className="text-muted-foreground">{portfolio.email}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {portfolio.socialLinks?.linkedin && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {portfolio.socialLinks?.github && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {portfolio.socialLinks?.twitter && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={portfolio.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {portfolio.socialLinks?.portfolio && (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={portfolio.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => setIsAddSectionOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Profile Section
              </Button>
              <Button variant="outline" onClick={handleExportResume} className="gap-2">
                <Download className="h-4 w-4" />
                Export Resume
              </Button>
              <Button variant="outline" onClick={handleShareProfile} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share Profile
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* About Section */}
            {portfolio.about && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    About
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingAbout(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{portfolio.about}</p>
                </CardContent>
              </Card>
            )}

            {/* Skills Section */}
            {portfolio.skills.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Skills
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingSkill({ id: '', name: '', level: 'intermediate', category: '' })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills.map((skill) => (
                      <Badge 
                        key={skill.id} 
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => setEditingSkill(skill)}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages Section */}
            {portfolio.languages.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Languages
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingLanguage({ id: '', name: '', proficiency: 'conversational' })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {portfolio.languages.map((language) => (
                      <div 
                        key={language.id} 
                        className="flex justify-between items-center cursor-pointer hover:bg-muted/50 p-1 rounded"
                        onClick={() => setEditingLanguage(language)}
                      >
                        <span className="text-sm">{language.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {language.proficiency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Experience, Education, etc. */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="experience" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="more">More</TabsTrigger>
              </TabsList>

              <TabsContent value="experience" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Work Experience
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline"
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
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>

                {portfolio.experience.map((exp) => (
                  <Card key={exp.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
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
                            <p className="mt-3 text-sm">{exp.description}</p>
                          )}
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
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline"
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
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>

                {portfolio.education.map((edu) => (
                  <Card key={edu.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {edu.startDate} - {edu.endDate}
                            </span>
                            {edu.grade && (
                              <span>Grade: {edu.grade}</span>
                            )}
                          </div>
                          {edu.description && (
                            <p className="mt-3 text-sm">{edu.description}</p>
                          )}
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
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Projects
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline"
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
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>

                {portfolio.projects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{project.title}</h4>
                          <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
                          {project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {project.technologies.map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {project.link && (
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary text-sm mt-3 hover:underline"
                            >
                              <Globe className="h-3 w-3" />
                              View Project
                            </a>
                          )}
                        </div>
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
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="more" className="space-y-6">
                {/* Certifications */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Certifications
                    </h3>
                    <Button 
                      size="sm" 
                      variant="outline"
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
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {portfolio.certifications.map((cert) => (
                    <Card key={cert.id} className="mb-3">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{cert.name}</h4>
                            <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Issued: {cert.issueDate}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingCertification(cert)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Publications */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Publications
                    </h3>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingPublication({
                        id: '',
                        title: '',
                        publisher: '',
                        publicationDate: '',
                        authors: [],
                        link: '',
                        description: ''
                      })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {portfolio.publications.map((pub) => (
                    <Card key={pub.id} className="mb-3">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{pub.title}</h4>
                            <p className="text-sm text-muted-foreground">{pub.publisher}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {pub.publicationDate}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingPublication(pub)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Volunteering */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Volunteering
                    </h3>
                    <Button 
                      size="sm" 
                      variant="outline"
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
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  {portfolio.volunteering.map((vol) => (
                    <Card key={vol.id} className="mb-3">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{vol.role}</h4>
                            <p className="text-sm text-muted-foreground">{vol.organization}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {vol.startDate} - {vol.current ? 'Present' : vol.endDate}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingVolunteering(vol)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Resumes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload Resume</p>
                  </div>
                  {portfolio.resumes.map((resume) => (
                    <Card key={resume.id} className="relative group">
                      <CardContent className="p-4">
                        <div className="aspect-[8.5/11] bg-muted rounded flex items-center justify-center mb-2">
                          <span className="text-4xl text-muted-foreground">📄</span>
                        </div>
                        <p className="text-sm font-medium truncate">{resume.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddProfileSectionDialog 
        open={isAddSectionOpen} 
        onOpenChange={setIsAddSectionOpen}
        onAddSection={(section) => {
          switch(section) {
            case 'about':
              setEditingAbout(true);
              break;
            case 'experience':
              setEditingExperience({
                id: '',
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
              });
              break;
            case 'education':
              setEditingEducation({
                id: '',
                degree: '',
                institution: '',
                location: '',
                startDate: '',
                endDate: '',
                grade: '',
                description: ''
              });
              break;
            case 'projects':
              setEditingProject({
                id: '',
                title: '',
                description: '',
                technologies: [],
                link: '',
                startDate: '',
                endDate: ''
              });
              break;
            case 'skills':
              setEditingSkill({ id: '', name: '', level: 'intermediate', category: '' });
              break;
            case 'certifications':
              setEditingCertification({
                id: '',
                name: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
                credentialId: '',
                credentialUrl: ''
              });
              break;
            case 'publications':
              setEditingPublication({
                id: '',
                title: '',
                publisher: '',
                publicationDate: '',
                authors: [],
                link: '',
                description: ''
              });
              break;
            case 'volunteering':
              setEditingVolunteering({
                id: '',
                role: '',
                organization: '',
                cause: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
              });
              break;
            case 'languages':
              setEditingLanguage({ id: '', name: '', proficiency: 'conversational' });
              break;
          }
          setIsAddSectionOpen(false);
        }}
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
          onSave={(exp) => {
            if (editingExperience.id) {
              updateExperience(editingExperience.id, exp);
            } else {
              addExperience(exp);
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
          onSave={(edu) => {
            if (editingEducation.id) {
              updateEducation(editingEducation.id, edu);
            } else {
              addEducation(edu);
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
          onSave={(proj) => {
            if (editingProject.id) {
              updateProject(editingProject.id, proj);
            } else {
              addProject(proj);
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
            if (editingSkill.id) {
              updateSkill(editingSkill.id, skill);
            } else {
              addSkill(skill);
            }
            setEditingSkill(null);
          }}
          onDelete={editingSkill.id ? () => {
            deleteSkill(editingSkill.id);
            setEditingSkill(null);
            toast.success("Skill deleted");
          } : undefined}
        />
      )}

      {editingCertification && (
        <EditCertificationDialog
          open={!!editingCertification}
          onOpenChange={(open) => !open && setEditingCertification(null)}
          certification={editingCertification}
          onSave={(cert) => {
            if (editingCertification.id) {
              updateCertification(editingCertification.id, cert);
            } else {
              addCertification(cert);
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
          onSave={(pub) => {
            if (editingPublication.id) {
              updatePublication(editingPublication.id, pub);
            } else {
              addPublication(pub);
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
          onSave={(vol) => {
            if (editingVolunteering.id) {
              updateVolunteering(editingVolunteering.id, vol);
            } else {
              addVolunteering(vol);
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
          onSave={(lang) => {
            if (editingLanguage.id) {
              updateLanguage(editingLanguage.id, lang);
            } else {
              addLanguage(lang);
            }
            setEditingLanguage(null);
          }}
          onDelete={editingLanguage.id ? () => {
            deleteLanguage(editingLanguage.id);
            setEditingLanguage(null);
            toast.success("Language deleted");
          } : undefined}
        />
      )}
    </div>
  );
};

export default Portfolio;