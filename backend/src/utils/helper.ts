import { TrustBadge } from '../types/index';

export function getTrustBadge(score: number): TrustBadge {
  if (score >= 80) return { level: 'HIGH', label: 'High Trust', color: 'green', emoji: '🟢' };
  if (score >= 60) return { level: 'MEDIUM', label: 'Medium Trust', color: 'yellow', emoji: '🟡' };
  if (score >= 40) return { level: 'LOW', label: 'Low Trust', color: 'orange', emoji: '🟠' };
  return { level: 'VERY_LOW', label: 'Very Low Trust', color: 'red', emoji: '🔴' };
}

export function getTrustScoreBreakdown(job: any) {
  const breakdown = {
    total: job.trustScore || 0,
    factors: [
      { name: 'Description', score: job.description ? 100 : 0, weight: 10 },
      { name: 'Requirements', score: job.requirements ? 100 : 0, weight: 10 },
      { name: 'Salary Range', score: job.salaryRange ? 100 : 0, weight: 10 },
      { name: 'Company Logo', score: job.hasCompanyLogo ? 100 : 0, weight: 5 },
    ],
  };
  return breakdown;
}