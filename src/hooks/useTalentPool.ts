import { useState, useEffect } from 'react';
import { CandidateProfile, TalentPoolStats } from '@/types/candidate';

const STORAGE_KEY = 'talent_pool_candidates';

export const useTalentPool = () => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [stats, setStats] = useState<TalentPoolStats>({
    totalCandidates: 0,
    verifiedProfiles: 0,
    shortlistedForPrograms: 0,
    applicantsInProgress: 0,
    acceptedOfferReceived: 0,
    scholarshipEligible: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load candidates from localStorage
  useEffect(() => {
    const loadCandidates = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setCandidates(data);
          calculateStats(data);
        } else {
          // Initialize with sample data
          const sampleData = generateSampleCandidates();
          setCandidates(sampleData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
          calculateStats(sampleData);
        }
      } catch (error) {
        console.error('Error loading candidates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCandidates();
  }, []);

  // Calculate statistics
  const calculateStats = (data: CandidateProfile[]) => {
    const newStats: TalentPoolStats = {
      totalCandidates: data.length,
      verifiedProfiles: data.filter(c => c.isVerified).length,
      shortlistedForPrograms: data.filter(c => c.isShortlisted).length,
      applicantsInProgress: data.filter(c => 
        c.applicationStage === 'Applied' || 
        c.applicationStage === 'Documents Submitted'
      ).length,
      acceptedOfferReceived: data.filter(c => c.applicationStage === 'Offer Received').length,
      scholarshipEligible: data.filter(c => c.scholarshipEligible).length,
    };
    setStats(newStats);
  };

  // Add new candidate
  const addCandidate = (candidate: Omit<CandidateProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCandidate: CandidateProfile = {
      ...candidate,
      id: `candidate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...candidates, newCandidate];
    setCandidates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    calculateStats(updated);
    return newCandidate;
  };

  // Update candidate
  const updateCandidate = (id: string, updates: Partial<CandidateProfile>) => {
    const updated = candidates.map(c => 
      c.id === id 
        ? { ...c, ...updates, updatedAt: new Date().toISOString() }
        : c
    );
    setCandidates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    calculateStats(updated);
  };

  // Delete candidate
  const deleteCandidate = (id: string) => {
    const updated = candidates.filter(c => c.id !== id);
    setCandidates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    calculateStats(updated);
  };

  // Get candidate by ID
  const getCandidateById = (id: string) => {
    return candidates.find(c => c.id === id);
  };

  // Filter candidates
  const filterCandidates = (filters: {
    stage?: string;
    eligibility?: string;
    country?: string;
    programLevel?: string;
    verified?: boolean;
    shortlisted?: boolean;
    scholarshipEligible?: boolean;
  }) => {
    return candidates.filter(candidate => {
      if (filters.stage && candidate.applicationStage !== filters.stage) return false;
      if (filters.eligibility && candidate.eligibilityStatus !== filters.eligibility) return false;
      if (filters.country && !candidate.preferredCountries.includes(filters.country)) return false;
      if (filters.programLevel && candidate.programLevel !== filters.programLevel) return false;
      if (filters.verified !== undefined && candidate.isVerified !== filters.verified) return false;
      if (filters.shortlisted !== undefined && candidate.isShortlisted !== filters.shortlisted) return false;
      if (filters.scholarshipEligible !== undefined && candidate.scholarshipEligible !== filters.scholarshipEligible) return false;
      return true;
    });
  };

  return {
    candidates,
    stats,
    loading,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    getCandidateById,
    filterCandidates,
  };
};

// Generate sample candidates for initial load
const generateSampleCandidates = (): CandidateProfile[] => {
  return [
    {
      id: 'candidate_1',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91-9876543210',
      dateOfBirth: '2001-05-15',
      gender: 'Female',
      nationality: 'Indian',
      currentLocation: 'Mumbai, India',
      intendedProgram: 'Masters in Computer Science',
      programLevel: 'PG',
      preferredCountries: ['Canada', 'Ireland', 'Finland'],
      interests: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
      careerAspirations: 'AI Research Scientist',
      academicRecords: [
        {
          level: 'Bachelor',
          institution: 'Mumbai University',
          percentage: 85,
          cgpa: 8.5,
          yearOfCompletion: '2023',
          stream: 'Computer Engineering'
        }
      ],
      examScores: [
        {
          examType: 'IELTS',
          score: '7.5',
          band: 7.5,
          date: '2024-01-15',
          expiryDate: '2026-01-15'
        }
      ],
      financialInfo: {
        budget: 30000,
        currency: 'USD',
        sponsors: 'Parents',
        bankStatementAvailable: true
      },
      documents: [],
      communicationLogs: [],
      applicationStage: 'Counseling Done',
      eligibilityStatus: 'Eligible',
      isVerified: true,
      isShortlisted: true,
      scholarshipEligible: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
    {
      id: 'candidate_2',
      name: 'Rahul Patel',
      email: 'rahul.patel@email.com',
      phone: '+91-9876543211',
      dateOfBirth: '2000-08-20',
      gender: 'Male',
      nationality: 'Indian',
      currentLocation: 'Delhi, India',
      intendedProgram: 'MBA',
      programLevel: 'PG',
      preferredCountries: ['UAE', 'UK', 'Australia'],
      interests: ['Business Strategy', 'Marketing', 'Entrepreneurship'],
      academicRecords: [
        {
          level: 'Bachelor',
          institution: 'Delhi University',
          percentage: 78,
          cgpa: 7.8,
          yearOfCompletion: '2022',
          stream: 'Commerce'
        }
      ],
      examScores: [
        {
          examType: 'IELTS',
          score: '6.5',
          band: 6.5,
          date: '2024-02-10',
          expiryDate: '2026-02-10'
        },
        {
          examType: 'GMAT',
          score: '680',
          date: '2024-03-15',
        }
      ],
      financialInfo: {
        budget: 40000,
        currency: 'USD',
        sponsors: 'Self + Loan',
        bankStatementAvailable: true
      },
      documents: [],
      communicationLogs: [],
      applicationStage: 'Documents Submitted',
      eligibilityStatus: 'Eligible',
      isVerified: true,
      isShortlisted: false,
      scholarshipEligible: false,
      createdAt: '2024-02-01T10:00:00Z',
      updatedAt: '2024-03-20T14:30:00Z',
    },
    {
      id: 'candidate_3',
      name: 'Ananya Singh',
      email: 'ananya.singh@email.com',
      phone: '+91-9876543212',
      dateOfBirth: '2002-03-10',
      gender: 'Female',
      nationality: 'Indian',
      currentLocation: 'Bangalore, India',
      intendedProgram: 'BSc Nursing',
      programLevel: 'UG',
      preferredCountries: ['Finland', 'Ireland', 'Canada'],
      interests: ['Healthcare', 'Patient Care', 'Medical Research'],
      academicRecords: [
        {
          level: '12th',
          institution: 'National Public School',
          board: 'CBSE',
          percentage: 92,
          yearOfCompletion: '2020',
          stream: 'Science (PCB)'
        }
      ],
      examScores: [
        {
          examType: 'IELTS',
          score: '7.0',
          band: 7.0,
          date: '2024-01-20',
          expiryDate: '2026-01-20'
        }
      ],
      financialInfo: {
        budget: 25000,
        currency: 'USD',
        sponsors: 'Parents',
        bankStatementAvailable: true
      },
      documents: [],
      communicationLogs: [],
      applicationStage: 'Applied',
      eligibilityStatus: 'Eligible',
      isVerified: true,
      isShortlisted: true,
      scholarshipEligible: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-03-25T14:30:00Z',
    },
    {
      id: 'candidate_4',
      name: 'Vikram Mehta',
      email: 'vikram.mehta@email.com',
      phone: '+91-9876543213',
      dateOfBirth: '2001-11-05',
      gender: 'Male',
      nationality: 'Indian',
      currentLocation: 'Pune, India',
      intendedProgram: 'Masters in Data Science',
      programLevel: 'PG',
      preferredCountries: ['Finland', 'Germany', 'Netherlands'],
      interests: ['Big Data', 'Analytics', 'AI'],
      academicRecords: [
        {
          level: 'Bachelor',
          institution: 'BITS Pilani',
          percentage: 88,
          cgpa: 8.8,
          yearOfCompletion: '2023',
          stream: 'Information Technology'
        }
      ],
      examScores: [
        {
          examType: 'IELTS',
          score: '8.0',
          band: 8.0,
          date: '2024-02-05',
          expiryDate: '2026-02-05'
        },
        {
          examType: 'GRE',
          score: '325',
          date: '2024-03-10',
        }
      ],
      financialInfo: {
        budget: 35000,
        currency: 'USD',
        sponsors: 'Self',
        bankStatementAvailable: true
      },
      documents: [],
      communicationLogs: [],
      applicationStage: 'Offer Received',
      eligibilityStatus: 'Eligible',
      isVerified: true,
      isShortlisted: true,
      scholarshipEligible: true,
      createdAt: '2024-02-10T10:00:00Z',
      updatedAt: '2024-04-01T14:30:00Z',
    },
    {
      id: 'candidate_5',
      name: 'Neha Kapoor',
      email: 'neha.kapoor@email.com',
      phone: '+91-9876543214',
      dateOfBirth: '2003-06-25',
      gender: 'Female',
      nationality: 'Indian',
      currentLocation: 'Chennai, India',
      intendedProgram: 'Bachelor in Business Administration',
      programLevel: 'UG',
      preferredCountries: ['UAE', 'Ireland', 'UK'],
      interests: ['Marketing', 'Finance', 'International Business'],
      academicRecords: [
        {
          level: '12th',
          institution: 'DAV Public School',
          board: 'CBSE',
          percentage: 87,
          yearOfCompletion: '2021',
          stream: 'Commerce'
        }
      ],
      examScores: [
        {
          examType: 'IELTS',
          score: '6.0',
          band: 6.0,
          date: '2024-03-01',
          expiryDate: '2026-03-01'
        }
      ],
      financialInfo: {
        budget: 20000,
        currency: 'USD',
        sponsors: 'Parents + Scholarship',
        bankStatementAvailable: true
      },
      documents: [],
      communicationLogs: [],
      applicationStage: 'Lead',
      eligibilityStatus: 'Needs Improvement',
      isVerified: false,
      isShortlisted: false,
      scholarshipEligible: true,
      createdAt: '2024-03-01T10:00:00Z',
      updatedAt: '2024-03-15T14:30:00Z',
    },
  ];
};
