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
    const existingIndex = criteriaConfigs.findIndex(c => c.courseId === courseId);
    const now = new Date();
    
    let updatedConfigs;
    if (existingIndex >= 0) {
      updatedConfigs = [...criteriaConfigs];
      updatedConfigs[existingIndex] = {
        courseId,
        minimumScore,
        criteria,
        createdAt: criteriaConfigs[existingIndex].createdAt,
        updatedAt: now
      };
    } else {
      updatedConfigs = [...criteriaConfigs, {
        courseId,
        minimumScore,
        criteria,
        createdAt: now,
        updatedAt: now
      }];
    }
    
    setCriteriaConfigs(updatedConfigs);
    localStorage.setItem('matchingCriteria', JSON.stringify(updatedConfigs));
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