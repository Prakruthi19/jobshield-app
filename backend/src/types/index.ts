export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'JOBSEEKER' | 'EMPLOYER' | 'ADMIN';
  isVerified: boolean;
}

export interface JobData {
  title?: string;
  location?: string;
  department?: string;
  salaryRange?: string;
  companyProfile?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  telecommuting?: number;
  hasCompanyLogo?: number;
  hasQuestions?: number;
  employmentType?: string;
  requiredExperience?: string;
  requiredEducation?: string;
  industry?: string;
  function?: string;
}

export interface MLPrediction {
  fraudProbability: number;
  isFraudulent: boolean;
  confidence: number;
  topFraudIndicators: string[];
}

export interface TrustBadge {
  level: 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY_LOW';
  label: string;
  color: string;
  emoji: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
