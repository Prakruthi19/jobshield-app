import type {EmployerApplication} from "../../../types/applications";
import "./EmployerApplicationsPage.scss";

interface EmployerApplicationsPageProps {
     jobApplications: EmployerApplication[];

}
export default function EmployerApplicationsPage( { jobApplications }: EmployerApplicationsPageProps) {


  if (jobApplications?.length === 0) return <p>No applications yet.</p>;

  return (
    <div className="employer-applications">

      {jobApplications.map(app => (
        <div key={app.id} className="application-card">

          <div className="job-section">
            <h3>{app.job.title}</h3>
            <span>{app.job.location}</span>
          </div>

          <div className="candidate-section">
            <h4>{app.user.firstName} {app.user.lastName}</h4>
            <p>{app.user.email}</p>
            {app.user.phone && <p>{app.user.phone}</p>}
            <small>Applied on {new Date(app.createdAt).toLocaleDateString()}</small>
          </div>

          <a
            className="resume-btn"
            href={`http://localhost:5000${app.resumeUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resume
          </a>

        </div>
      ))}

    </div>
  );
}
