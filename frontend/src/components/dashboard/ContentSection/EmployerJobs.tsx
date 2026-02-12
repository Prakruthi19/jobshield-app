import { useState } from "react";
import "./EmployerJobs.scss";
import Modal from "@mui/material/Modal";
import JobForm from "../CreateJobForm/createJobForm";
import type { Job } from "../../../types/job";
import { mapJobToFormData } from "../../../helper";


interface Props {
  jobsList: Job[];
  onDeleteJob: (jobId: string) => void;
  onUpdateJob: (jobId: string, updatedData: any) => void;
}

const EmployerJobs = ({ jobsList, onDeleteJob, onUpdateJob }: Props) => {
    const [editingJob, setEditingJob] = useState<Job | null>(null);
  return (
    <div className="employer-jobs">

      {jobsList.length === 0 && (
        <p className="empty">No jobs posted yet.</p>
      )}

      {jobsList.length > 0 && (
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Department</th>
              <th>Trust</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobsList.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.location}</td>
                <td>{job.department}</td>
                <td>{job.trustScore}</td>
                <td>
                  <span className={`status ${job.status.toLowerCase()}`}>
                    {job.status}
                  </span>
                </td>
                  {job.status === "ACTIVE" && (
                    <>
                   <td className="actions">
                    <button className="edit-btn" onClick={() => setEditingJob(job)}>Edit</button>
                    <button className="delete-btn" onClick={() => onDeleteJob && onDeleteJob(job.id)}>Close</button>
                       </td>
                    </>
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
       {editingJob && (
        <Modal
        open={!!editingJob}
        onClose={() => setEditingJob(null)}
      >
        <div className="modal-wrapper">
          <JobForm
            initialData={editingJob ? mapJobToFormData(editingJob) : undefined}
            onClose={() => setEditingJob(null)}
            onSubmit={async (data) => {
              if (!editingJob) return;
              await onUpdateJob(editingJob.id, data);
              setEditingJob(null);
            }}
          />
        </div>
      </Modal>
      )}
    </div>
  );
};

export default EmployerJobs;