import React, { useState } from 'react';
import { Briefcase, Bookmark, Search, TrendingUp } from 'lucide-react';
import TrustScore from '../TrustScore/TrustScore';
import './ContentSection.scss';

interface ContentSectionProps {
  activeSection: string;
  userScore: number;
}

export default function ContentSection({ activeSection, userScore }: ContentSectionProps) {
  const placeholders = {
    applied: { icon: Briefcase, title: 'Applied Jobs', text: 'Your job applications will appear here' },
    saved: { icon: Bookmark, title: 'Saved Jobs', text: "Jobs you've bookmarked will appear here" },
    recommended: { icon: Search, title: 'Recommended Jobs', text: 'Personalized job recommendations based on your profile' },
  };
 if (activeSection === 'analytics') return <TrustScore userScore={userScore} />;

  // Narrow type so TypeScript knows activeSection is a key of placeholders
  if (!(activeSection in placeholders)) return null;

  const placeholder = placeholders[activeSection as keyof typeof placeholders];
  const PlaceholderIcon = placeholder.icon;

  return (
    <div className="placeholder">
      <PlaceholderIcon className="placeholder__icon" size={48} />
      <h3 className="placeholder__title">{placeholder.title}</h3>
      <p className="placeholder__text">{placeholder.text}</p>
    </div>
  );
}
