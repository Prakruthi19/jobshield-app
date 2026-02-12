import React, { useState } from "react";
import type { Job } from "../../../types/job";
import "./JobDetails.scss";

interface Props {
  job: Job;
  onClose: () => void;
}

const JobDetailsModal: React.FC<Props> = ({ job, onClose }) => {

  const fraudPercent = Math.round(Number(job.mlFraudProbability ?? 0) * 100);

  const riskLevel =
    fraudPercent < 30 ? "low" :
    fraudPercent < 70 ? "medium" :
    "high";

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>{job.title}</h2>
            <p className="company">{job.company.name}</p>
          </div>

          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Risk Banner */}
        <div className={`risk-banner ${riskLevel}`}>
          Fraud Risk: {fraudPercent}%
        </div>

        {/* Meta */}
        <div className="meta">
          <span>{job.location}</span>
          <span>{job.employmentType}</span>
          {job.telecommuting === 1 && <span>Remote</span>}
          {job.salaryRange && <span>{job.salaryRange}</span>}
        </div>

        {/* Sections */}
        <section>
          <h4>About Company</h4>
          <p>{job.companyProfile}</p>
        </section>

        <section>
          <h4>Description</h4>
          <p>{job.description}</p>
        </section>

        <section>
          <h4>Requirements</h4>
          <p>{job.requirements}</p>
        </section>

        <section>
          <h4>Benefits</h4>
          <p>{job.benefits}</p>
        </section>
         <section>
          <h4>Salary</h4>
          <p>{job.salaryRange}</p>
        </section>

      </div>
    </div>
  );
};

export default JobDetailsModal;
