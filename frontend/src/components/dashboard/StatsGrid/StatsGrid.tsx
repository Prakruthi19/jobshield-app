import React from 'react';
import { Briefcase, Bookmark, TrendingUp } from 'lucide-react';
import './StatsGrid.scss';

interface StatsGridProps {
  stats: { appliedJobs: number; savedJobs: number; interviews: number };
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    { label: 'Applied Jobs', value: stats.appliedJobs, icon: Briefcase, color: 'blue' },
    { label: 'Saved Jobs', value: stats.savedJobs, icon: Bookmark, color: 'green' },
    { label: 'Interviews', value: stats.interviews, icon: TrendingUp, color: 'purple' },
  ];

  return (
    <div className="stats-grid">
      {statCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div className="stat-card" key={i}>
            <div className="stat-card__content">
              <div className="stat-card__info">
                <p className="stat-card__label">{card.label}</p>
                <p className="stat-card__value">{card.value}</p>
              </div>
              <div className={`stat-card__icon stat-card__icon--${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
