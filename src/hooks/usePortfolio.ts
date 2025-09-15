import { useState, useEffect } from 'react';
import { Portfolio, Experience, Education, Project, Certification, Publication, Volunteering, Skill, Language } from '@/types/portfolio';

const initialPortfolio: Portfolio = {
  id: '1',
  userId: '1',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  about: '',
  profileImage: '',
  socialLinks: {},
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  publications: [],
  volunteering: [],
  skills: [],
  languages: [],
  resumes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load portfolio from localStorage
    const savedPortfolio = localStorage.getItem('userPortfolio');
    const userData = localStorage.getItem('userAuth');
    
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    } else if (userData) {
      // Initialize with user data if available
      const user = JSON.parse(userData);
      setPortfolio(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
    setIsLoading(false);
  }, []);

  const savePortfolio = (updatedPortfolio: Portfolio) => {
    const portfolioToSave = {
      ...updatedPortfolio,
      updatedAt: new Date().toISOString(),
    };
    setPortfolio(portfolioToSave);
    localStorage.setItem('userPortfolio', JSON.stringify(portfolioToSave));
  };

  const updateBasicInfo = (info: Partial<Portfolio>) => {
    const updated = { ...portfolio, ...info };
    savePortfolio(updated);
  };

  const updateAbout = (about: string) => {
    const updated = { ...portfolio, about };
    savePortfolio(updated);
  };

  // Experience methods
  const addExperience = (experience: Omit<Experience, 'id'>) => {
    const newExperience: Experience = {
      ...experience,
      id: Date.now().toString(),
    };
    const updated = {
      ...portfolio,
      experience: [...portfolio.experience, newExperience],
    };
    savePortfolio(updated);
  };

  const updateExperience = (id: string, experience: Partial<Experience>) => {
    const updated = {
      ...portfolio,
      experience: portfolio.experience.map(exp =>
        exp.id === id ? { ...exp, ...experience } : exp
      ),
    };
    savePortfolio(updated);
  };

  const deleteExperience = (id: string) => {
    const updated = {
      ...portfolio,
      experience: portfolio.experience.filter(exp => exp.id !== id),
    };
    savePortfolio(updated);
  };

  // Education methods
  const addEducation = (education: Omit<Education, 'id'>) => {
    const newEducation: Education = {
      ...education,
      id: Date.now().toString(),
    };
    const updated = {
      ...portfolio,
      education: [...portfolio.education, newEducation],
    };
    savePortfolio(updated);
  };

  const updateEducation = (id: string, education: Partial<Education>) => {
    const updated = {
      ...portfolio,
      education: portfolio.education.map(edu =>
        edu.id === id ? { ...edu, ...education } : edu
      ),
    };
    savePortfolio(updated);
  };

  const deleteEducation = (id: string) => {
    const updated = {
      ...portfolio,
      education: portfolio.education.filter(edu => edu.id !== id),
    };
    savePortfolio(updated);
  };

  // Projects methods
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    };
    const updated = {
      ...portfolio,
      projects: [...portfolio.projects, newProject],
    };
    savePortfolio(updated);
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    const updated = {
      ...portfolio,
      projects: portfolio.projects.map(proj =>
        proj.id === id ? { ...proj, ...project } : proj
      ),
    };
    savePortfolio(updated);
  };

  const deleteProject = (id: string) => {
    const updated = {
      ...portfolio,
      projects: portfolio.projects.filter(proj => proj.id !== id),
    };
    savePortfolio(updated);
  };

  // Skills methods
  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skill,
      id: Date.now().toString(),
    };
    const updated = {
      ...portfolio,
      skills: [...portfolio.skills, newSkill],
    };
    savePortfolio(updated);
  };

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    const updated = {
      ...portfolio,
      skills: portfolio.skills.map(s =>
        s.id === id ? { ...s, ...skill } : s
      ),
    };
    savePortfolio(updated);
  };

  const deleteSkill = (id: string) => {
    const updated = {
      ...portfolio,
      skills: portfolio.skills.filter(s => s.id !== id),
    };
    savePortfolio(updated);
  };

  // Certifications methods
  const addCertification = (certification: Omit<Certification, 'id'>) => {
    const newCertification: Certification = {
      ...certification,
      id: Date.now().toString(),
    };
    const updated = {
      ...portfolio,
      certifications: [...portfolio.certifications, newCertification],
    };
    savePortfolio(updated);
  };

  const updateCertification = (id: string, certification: Partial<Certification>) => {
    const updated = {
      ...portfolio,
      certifications: portfolio.certifications.map(cert =>
        cert.id === id ? { ...cert, ...certification } : cert
      ),
    };
    savePortfolio(updated);
  };

  const deleteCertification = (id: string) => {
    const updated = {
      ...portfolio,
      certifications: portfolio.certifications.filter(cert => cert.id !== id),
    };
    savePortfolio(updated);
  };

  // Publications methods
  const addPublication = (publication: Omit<Publication, 'id'>) => {
    const newPublication: Publication = {
      ...publication,
      id: Date.now().toString(),
    };
    const updated = {
      ...portfolio,
      publications: [...portfolio.publications, newPublication],
    };
    savePortfolio(updated);
  };

  const updatePublication = (id: string, publication: Partial<Publication>) => {
    const updated = {
      ...portfolio,
      publications: portfolio.publications.map(pub =>
        pub.id === id ? { ...pub, ...publication } : pub
      ),
    };
    savePortfolio(updated);
  };

  const deletePublication = (id: string) => {
    const updated = {
      ...portfolio,
      publications: portfolio.publications.filter(pub => pub.id !== id),
    };
    savePortfolio(updated);
  };

  // Volunteering methods
  const addVolunteering = (volunteering: Omit<Volunteering, 'id'>) => {
    const newVolunteering: Volunteering = {
      ...volunteering,
      id: Date.now().toString(),
    };
    const updated = {
      ...portfolio,
      volunteering: [...portfolio.volunteering, newVolunteering],
    };
    savePortfolio(updated);
  };

  const updateVolunteering = (id: string, volunteering: Partial<Volunteering>) => {
    const updated = {
      ...portfolio,
      volunteering: portfolio.volunteering.map(vol =>
        vol.id === id ? { ...vol, ...volunteering } : vol
      ),
    };
    savePortfolio(updated);
  };

  const deleteVolunteering = (id: string) => {
    const updated = {
      ...portfolio,
      volunteering: portfolio.volunteering.filter(vol => vol.id !== id),
    };
    savePortfolio(updated);
  };

  // Languages methods
  const addLanguage = (language: Omit<Language, 'id'>) => {
    const newLanguage: Language = {
      ...language,
      id: Date.now().toString(),
    };
    const updated = {
      ...portfolio,
      languages: [...portfolio.languages, newLanguage],
    };
    savePortfolio(updated);
  };

  const updateLanguage = (id: string, language: Partial<Language>) => {
    const updated = {
      ...portfolio,
      languages: portfolio.languages.map(lang =>
        lang.id === id ? { ...lang, ...language } : lang
      ),
    };
    savePortfolio(updated);
  };

  const deleteLanguage = (id: string) => {
    const updated = {
      ...portfolio,
      languages: portfolio.languages.filter(lang => lang.id !== id),
    };
    savePortfolio(updated);
  };

  const exportPortfolio = () => {
    const dataStr = JSON.stringify(portfolio, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `portfolio_${portfolio.firstName}_${portfolio.lastName}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    portfolio,
    isLoading,
    updateBasicInfo,
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
    exportPortfolio,
  };
};