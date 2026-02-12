import React from 'react';
import { Briefcase, Bookmark, TrendingUp, MoveRight, Check } from 'lucide-react';
import './StatsGrid.scss';

interface StatsGridProps {
   stats: { activejobs: number; applied: number; saved: number, recommended: number; analytics: number };
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    { label: 'Active Jobs', value: stats.activejobs, icon: Briefcase, color: 'blue' },
    { label: 'Applied Jobs', value: stats.applied, icon: Check, color: 'green' },
    { label: 'Saved Jobs', value: stats.saved, icon: Bookmark, color: 'yellow' },

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
