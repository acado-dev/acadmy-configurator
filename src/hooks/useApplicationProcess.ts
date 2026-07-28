import { useState, useEffect } from 'react';

export interface MatchingCriterion {
  id: string;
  fieldName: string;
  type: 'required' | 'weighted' | 'preferred';
  weight: number;
  conditions: string[];
}

export interface MatchingCriteriaConfig {
  courseId: string;
  minimumScore: number;
  criteria: MatchingCriterion[];
  createdAt: Date;
  updatedAt: Date;
}

export const useApplicationProcess = () => {
  const [criteriaConfigs, setCriteriaConfigs] = useState<MatchingCriteriaConfig[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('matchingCriteria');
    if (stored) {
      setCriteriaConfigs(JSON.parse(stored));
    }
  }, []);

  const saveCriteriaConfig = (courseId: string, minimumScore: number, criteria: MatchingCriterion[]) => {
    const now = new Date();

    setCriteriaConfigs(prev => {
      const stored = localStorage.getItem('matchingCriteria');
      const base: MatchingCriteriaConfig[] = stored ? JSON.parse(stored) : prev;
      const existingIndex = base.findIndex(c => c.courseId === courseId);

      let updatedConfigs: MatchingCriteriaConfig[];
      if (existingIndex >= 0) {
        updatedConfigs = [...base];
        updatedConfigs[existingIndex] = {
          courseId,
          minimumScore,
          criteria,
          createdAt: base[existingIndex].createdAt,
          updatedAt: now,
        };
      } else {
        updatedConfigs = [...base, { courseId, minimumScore, criteria, createdAt: now, updatedAt: now }];
      }

      localStorage.setItem('matchingCriteria', JSON.stringify(updatedConfigs));
      return updatedConfigs;
    });

    return true;
  };


  const getCriteriaByCoursId = (courseId: string): MatchingCriteriaConfig | undefined => {
    return criteriaConfigs.find(c => c.courseId === courseId);
  };

  const deleteCriteriaConfig = (courseId: string) => {
    const updatedConfigs = criteriaConfigs.filter(c => c.courseId !== courseId);
    setCriteriaConfigs(updatedConfigs);
    localStorage.setItem('matchingCriteria', JSON.stringify(updatedConfigs));
  };

  return {
    criteriaConfigs,
    saveCriteriaConfig,
    getCriteriaByCoursId,
    deleteCriteriaConfig
  };
};