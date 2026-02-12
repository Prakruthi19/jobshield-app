// src/types/job.ts

export type TrustLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TrustColor = 'green' | 'yellow' | 'red';

export interface TrustBadge {
  level: TrustLevel;
  label: string;
  color: TrustColor;
  emoji: string;
}

export interface Company {
  id: string;
  name: string;
  hasCompanyLogo: 0 | 1;
  isVerified: boolean;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  department: string;
  salaryRange: string | null;
  companyProfile: string;
  description: string;
  requirements: string;
  benefits: string;

  telecommuting: 0 | 1;
  hasCompanyLogo: 0 | 1;
  hasQuestions: 0 | 1;

  employmentType: string;
  requiredExperience: string;
  requiredEducation: string;
  industry: string;
  function: string;

  // ML fields
  fraudulent: 0 | 1;
  mlFraudProbability: string; // stored as string from API
  mlModelVersion: string;
  mlPredictedAt: string; // ISO date string

  trustScore: number;
  trustScoreUpdatedAt: string;

  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  slug: string | null;

  companyId: string;
  postedByUserId: string;

  createdAt: string;
  updatedAt: string;

  // relations
  company: Company;
  trustBadge: TrustBadge;
}



export interface JobFormData {
  title: string;
  location: string;
  department: string;
  salaryRange: string;
  companyProfile: string;
  description: string;
  requirements: string;
  benefits: string;
  telecommuting: number;
  hasCompanyLogo: number;
  hasQuestions: number;
  employmentType: string;
  requiredExperience: string;
  requiredEducation: string;
  industry: string;
  function: string;
}
