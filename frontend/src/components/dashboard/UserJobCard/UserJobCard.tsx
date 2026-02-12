import React from "react";
import type { Job } from "../../../types/job";
import "./UserJobCard.scss";

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
  onView?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onView }) => {

  // --- Fraud % ---
  const fraudPercent = Math.round(Number(job.mlFraudProbability ?? 0) * 100);

  // --- Risk Level ---
  const riskLevel =
    fraudPercent < 30 ? "low" :
    fraudPercent < 70 ? "medium" :
    "high";

  const riskLabel =
    fraudPercent < 30 ? "Safe" :
    fraudPercent < 70 ? "Suspicious" :
    "High Risk";

  return (
    <div className="job-card">

      <div className="job-main">

        {/* LEFT SIDE */}
        <div className="job-left">

          <div className="job-card-header">
            <div>
              <h3 className="job-title">{job.title}</h3>

              <p className="company-name">
                {job.company.name}
                {job.company.isVerified && (
                  <span className="verified-badge">✔ Verified</span>
                )}
              </p>
            </div>
          </div>

          {/* Meta info */}
          <div className="job-meta">
            <span>{job.location}</span>
            <span>{job.employmentType}</span>
            {job.telecommuting === 1 && <span>Remote</span>}
            {job.salaryRange && <span className="salary">{job.salaryRange}</span>}
          </div>

          {/* Description */}
          <p className="job-description">
            {job.description}
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="job-right">

          {/* Trust Badge */}
          <span className={`trust-badge ${job.trustBadge.color}`}>
            {job.trustBadge.emoji} {job.trustBadge.label}
          </span>


          

          {/* Trust Score */}
          <small className="trust-score">
            Trust: <strong>{job.trustScore}</strong>
          </small>

          {/* Buttons */}
         <div className="job-actions">
            {onView && (
              <button
                className="secondary-btn"
                onClick={() => onView(job.id)}
              >
                Details
              </button>
            )}

            <button
              className="primary-btn"
              onClick={() => onApply(job.id)}
              disabled={job.status !== "ACTIVE"}
            >
              Apply
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default JobCard;
