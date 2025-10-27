import { useState, useEffect } from 'react';
import { useApplicationProcess, MatchingCriterion } from './useApplicationProcess';

export interface ApplicationSubmission {
  id: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  courseId: string;
  courseName: string;
  universityId: string;
  universityName: string;
  formId: string;
  formData: Record<string, any>;
  matchScore: number;
  matchDetails: MatchDetail[];
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected' | 'waitlisted';
  submittedAt: Date;
  lastUpdated: Date;
  documents: ApplicationDocument[];
}

export interface MatchDetail {
  criteriaId: string;
  fieldName: string;
  type: 'required' | 'weighted' | 'preferred';
  matched: boolean;
  score: number;
  maxScore: number;
  actualValue: any;
  expectedValue: any;
  reason?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: Date;
  status: 'pending' | 'verified' | 'rejected';
}

export interface ApplicationStats {
  totalApplications: number;
  byStatus: Record<string, number>;
  byCourse: Record<string, number>;
  averageMatchScore: number;
  highMatchCount: number; // Applications with score > 80%
  mediumMatchCount: number; // Applications with score 50-80%
  lowMatchCount: number; // Applications with score < 50%
}

export const useApplicationSubmissions = () => {
  const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
  const [stats, setStats] = useState<ApplicationStats>({
    totalApplications: 0,
    byStatus: {},
    byCourse: {},
    averageMatchScore: 0,
    highMatchCount: 0,
    mediumMatchCount: 0,
    lowMatchCount: 0
  });
  const { getCriteriaByCoursId } = useApplicationProcess();

  // Load applications from localStorage
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const stored = localStorage.getItem('applicationSubmissions');
    const dataVersion = localStorage.getItem('applicationSubmissions_version');
    
    // Force reload with new mock data if version changed
    if (stored && dataVersion === '2') {
      const parsedApps = JSON.parse(stored);
      setApplications(parsedApps);
      calculateStats(parsedApps);
    } else {
      // Initialize with mock data
      const mockApplications = generateMockApplications();
      setApplications(mockApplications);
      localStorage.setItem('applicationSubmissions', JSON.stringify(mockApplications));
      localStorage.setItem('applicationSubmissions_version', '2');
      calculateStats(mockApplications);
    }
  };

  const calculateMatchScore = (formData: Record<string, any>, courseId: string): { score: number; details: MatchDetail[] } => {
    const criteriaConfig = getCriteriaByCoursId(courseId);
    
    if (!criteriaConfig || !criteriaConfig.criteria.length) {
      // No criteria configured, return default score
      return { score: 75, details: [] };
    }

    let totalScore = 0;
    let maxPossibleScore = 0;
    const details: MatchDetail[] = [];

    criteriaConfig.criteria.forEach((criterion: MatchingCriterion) => {
      const fieldValue = formData[criterion.fieldName];
      let matched = false;
      let score = 0;
      const maxScore = criterion.weight;

      // Simple matching logic - can be enhanced based on field type
      if (criterion.type === 'required') {
        matched = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
        score = matched ? maxScore : 0;
      } else if (criterion.type === 'weighted') {
        // For weighted criteria, apply partial scoring
        if (fieldValue) {
          // Example scoring logic - can be customized
          const percentage = evaluateFieldValue(fieldValue, criterion.conditions);
          score = (percentage / 100) * maxScore;
          matched = percentage >= 50;
        }
      } else if (criterion.type === 'preferred') {
        // Preferred criteria add bonus points
        matched = fieldValue !== undefined && fieldValue !== null;
        score = matched ? maxScore : 0;
      }

      totalScore += score;
      maxPossibleScore += maxScore;

      details.push({
        criteriaId: criterion.id,
        fieldName: criterion.fieldName,
        type: criterion.type,
        matched,
        score,
        maxScore,
        actualValue: fieldValue || 'Not provided',
        expectedValue: criterion.conditions.join(' OR '),
        reason: matched ? 'Criteria met' : 'Criteria not met'
      });
    });

    const finalScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    return { score: finalScore, details };
  };

  const evaluateFieldValue = (value: any, conditions: string[]): number => {
    // Simple evaluation logic - can be enhanced
    if (!value) return 0;
    
    // Check if value meets any condition
    for (const condition of conditions) {
      if (condition.includes('>')) {
        const threshold = parseFloat(condition.replace('>', '').trim());
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && !isNaN(threshold)) {
          return numValue > threshold ? 100 : (numValue / threshold) * 100;
        }
      } else if (condition.includes('=')) {
        const expected = condition.replace('=', '').trim();
        if (value.toString().toLowerCase() === expected.toLowerCase()) {
          return 100;
        }
      } else if (value.toString().toLowerCase().includes(condition.toLowerCase())) {
        return 100;
      }
    }
    
    return 50; // Partial credit if value exists but doesn't match conditions
  };

  const calculateStats = (apps: ApplicationSubmission[]) => {
    const newStats: ApplicationStats = {
      totalApplications: apps.length,
      byStatus: {},
      byCourse: {},
      averageMatchScore: 0,
      highMatchCount: 0,
      mediumMatchCount: 0,
      lowMatchCount: 0
    };

    let totalScore = 0;

    apps.forEach(app => {
      // Count by status
      newStats.byStatus[app.status] = (newStats.byStatus[app.status] || 0) + 1;
      
      // Count by course
      newStats.byCourse[app.courseName] = (newStats.byCourse[app.courseName] || 0) + 1;
      
      // Calculate match score distribution
      totalScore += app.matchScore;
      if (app.matchScore > 80) {
        newStats.highMatchCount++;
      } else if (app.matchScore >= 50) {
        newStats.mediumMatchCount++;
      } else {
        newStats.lowMatchCount++;
      }
    });

    newStats.averageMatchScore = apps.length > 0 ? Math.round(totalScore / apps.length) : 0;
    setStats(newStats);
  };

  const submitApplication = (applicationData: Partial<ApplicationSubmission>) => {
    const newApplication: ApplicationSubmission = {
      id: `APP-${Date.now()}`,
      applicantName: applicationData.applicantName || '',
      applicantEmail: applicationData.applicantEmail || '',
      applicantPhone: applicationData.applicantPhone || '',
      courseId: applicationData.courseId || '',
      courseName: applicationData.courseName || '',
      universityId: applicationData.universityId || '',
      universityName: applicationData.universityName || '',
      formId: applicationData.formId || '',
      formData: applicationData.formData || {},
      matchScore: 0,
      matchDetails: [],
      status: 'submitted',
      submittedAt: new Date(),
      lastUpdated: new Date(),
      documents: applicationData.documents || []
    };

    // Calculate match score
    const { score, details } = calculateMatchScore(newApplication.formData, newApplication.courseId);
    newApplication.matchScore = score;
    newApplication.matchDetails = details;

    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('applicationSubmissions', JSON.stringify(updatedApplications));
    calculateStats(updatedApplications);

    return newApplication;
  };

  const updateApplicationStatus = (applicationId: string, newStatus: ApplicationSubmission['status']) => {
    const updatedApplications = applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: newStatus, lastUpdated: new Date() }
        : app
    );
    setApplications(updatedApplications);
    localStorage.setItem('applicationSubmissions', JSON.stringify(updatedApplications));
    calculateStats(updatedApplications);
  };

  const getApplicationById = (applicationId: string): ApplicationSubmission | undefined => {
    return applications.find(app => app.id === applicationId);
  };

  const getApplicationsByCourse = (courseId: string): ApplicationSubmission[] => {
    return applications.filter(app => app.courseId === courseId);
  };

  const getApplicationsByStatus = (status: ApplicationSubmission['status']): ApplicationSubmission[] => {
    return applications.filter(app => app.status === status);
  };

  const generateMockApplications = (): ApplicationSubmission[] => {
    const mockData = [
      {
        id: 'APP-001',
        applicantName: 'John Doe',
        applicantEmail: 'john.doe@example.com',
        applicantPhone: '+1 234-567-8900',
        courseId: 'mba',
        courseName: 'MBA in International Business',
        universityId: 'harvard',
        universityName: 'Harvard University',
        formId: 'form-1',
        formData: {
          gpa: '3.8',
          greScore: '325',
          workExperience: '3',
          englishProficiency: 'TOEFL 110',
          recommendations: '3'
        },
        matchScore: 92,
        matchDetails: [
          {
            criteriaId: '1',
            fieldName: 'gpa',
            type: 'required' as const,
            matched: true,
            score: 30,
            maxScore: 30,
            actualValue: '3.8',
            expectedValue: '>3.5'
          },
          {
            criteriaId: '2',
            fieldName: 'greScore',
            type: 'weighted' as const,
            matched: true,
            score: 25,
            maxScore: 25,
            actualValue: '325',
            expectedValue: '>320'
          }
        ],
        status: 'shortlisted' as const,
        submittedAt: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-16'),
        documents: []
      },
      {
        id: 'APP-002',
        applicantName: 'Jane Smith',
        applicantEmail: 'jane.smith@example.com',
        applicantPhone: '+1 234-567-8901',
        courseId: 'mscs',
        courseName: 'MS in Computer Science',
        universityId: 'harvard',
        universityName: 'Harvard University',
        formId: 'form-2',
        formData: {
          gpa: '3.6',
          greScore: '315',
          workExperience: '2',
          englishProficiency: 'IELTS 7.5'
        },
        matchScore: 78,
        matchDetails: [],
        status: 'under_review' as const,
        submittedAt: new Date('2024-01-14'),
        lastUpdated: new Date('2024-01-14'),
        documents: []
      },
      {
        id: 'APP-003',
        applicantName: 'Michael Johnson',
        applicantEmail: 'michael.j@example.com',
        applicantPhone: '+1 234-567-8902',
        courseId: 'mba',
        courseName: 'MBA in International Business',
        universityId: 'harvard',
        universityName: 'Harvard University',
        formId: 'form-1',
        formData: {
          gpa: '3.2',
          greScore: '310',
          workExperience: '5'
        },
        matchScore: 65,
        matchDetails: [],
        status: 'submitted' as const,
        submittedAt: new Date('2024-01-16'),
        lastUpdated: new Date('2024-01-16'),
        documents: []
      },
      {
        id: 'APP-004',
        applicantName: 'Sarah Williams',
        applicantEmail: 'sarah.w@example.com',
        applicantPhone: '+1 234-567-8903',
        courseId: 'exchange-eng',
        courseName: 'Engineering Exchange Program',
        universityId: 'harvard',
        universityName: 'Harvard University',
        formId: 'form-3',
        formData: {
          gpa: '3.9',
          currentProgram: 'Mechanical Engineering',
          year: 'Junior'
        },
        matchScore: 88,
        matchDetails: [],
        status: 'accepted' as const,
        submittedAt: new Date('2024-02-01'),
        lastUpdated: new Date('2024-02-15'),
        documents: []
      },
      {
        id: 'APP-005',
        applicantName: 'David Chen',
        applicantEmail: 'david.chen@example.com',
        applicantPhone: '+1 234-567-8904',
        courseId: 'mscs',
        courseName: 'MS in Computer Science',
        universityId: 'harvard',
        universityName: 'Harvard University',
        formId: 'form-2',
        formData: {
          gpa: '3.7',
          greScore: '328',
          programmingExperience: '4 years'
        },
        matchScore: 95,
        matchDetails: [],
        status: 'interview_scheduled' as const,
        submittedAt: new Date('2024-02-10'),
        lastUpdated: new Date('2024-02-20'),
        documents: []
      },
      {
        id: 'APP-006',
        applicantName: 'Emily Brown',
        applicantEmail: 'emily.b@example.com',
        applicantPhone: '+1 234-567-8905',
        courseId: 'data-science',
        courseName: 'Data Science Certificate',
        universityId: 'mit',
        universityName: 'MIT',
        formId: 'form-4',
        formData: {
          background: 'Statistics',
          pythonExperience: 'Advanced'
        },
        matchScore: 82,
        matchDetails: [],
        status: 'shortlisted' as const,
        submittedAt: new Date('2024-03-01'),
        lastUpdated: new Date('2024-03-05'),
        documents: []
      },
      {
        id: 'APP-007',
        applicantName: 'Robert Taylor',
        applicantEmail: 'robert.t@example.com',
        applicantPhone: '+1 234-567-8906',
        courseId: 'mba',
        courseName: 'MBA in International Business',
        universityId: 'harvard',
        universityName: 'Harvard University',
        formId: 'form-1',
        formData: {
          gpa: '3.1',
          greScore: '305',
          workExperience: '2'
        },
        matchScore: 58,
        matchDetails: [],
        status: 'rejected' as const,
        submittedAt: new Date('2024-01-20'),
        lastUpdated: new Date('2024-02-01'),
        documents: []
      }
    ];

    return mockData;
  };

  return {
    applications,
    stats,
    submitApplication,
    updateApplicationStatus,
    getApplicationById,
    getApplicationsByCourse,
    getApplicationsByStatus,
    calculateMatchScore,
    refreshApplications: loadApplications
  };
};