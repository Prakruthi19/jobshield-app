import React from 'react';
import './TrustScore.scss';

interface TrustScoreProps {
  userScore: number;
}

export default function TrustScore({ userScore }: TrustScoreProps) {
  return (
    <div className="trust-score">
      <div className="trust-score__info-box">
        <h4 className="trust-score__subtitle">How Job Trust Scores Work</h4>
        <p className="trust-score__description">
          Every job posting on our platform is assigned a trust score (0-100) based on multiple verification factors:
        </p>
        <ul className="trust-score__factors">
          <li>✓ Company verification status</li>
          <li>✓ Job posting completeness and clarity</li>
          <li>✓ Historical employer reputation</li>
          <li>✓ Salary transparency and market alignment</li>
          <li>✓ User feedback and reports</li>
        </ul>
        <div className="trust-score__example">
          <div className="trust-score__header">
            <span className="trust-score__label">Example Job Score</span>
            <span className="trust-score__value">{userScore}/100</span>
          </div>
          <div className="trust-score__bar">
            <div className="trust-score__progress" style={{ width: `${userScore}%` }}></div>
          </div>
          <p className="trust-score__rating">
            {userScore >= 80 ? '🟢 High Trust - Verified & Safe' :
             userScore >= 60 ? '🟡 Medium Trust - Use Caution' :
             '🔴 Low Trust - High Risk'}
          </p>
        </div>
      </div>
    </div>
  );
}
