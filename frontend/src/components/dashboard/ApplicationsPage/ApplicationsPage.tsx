
import "./ApplicationsPage.scss";
import type { Application } from "../../../types/applications";

interface ApplicationsPageProps {
  applications: Application[];
}
export default function ApplicationsPage({ applications }: ApplicationsPageProps) {

  if (applications.length === 0) return <p>You have not applied to any jobs.</p>;

  return (
    <div className="applications-page">
      {applications.map(app => (
        <div key={app.id} className="application-card">

          <div className="job-info">
            <h3>{app.job.title}</h3>
            <p>{app.job.company?.name}</p>
            <span>{app.job.location}</span>
          </div>

          <div className="application-info">
            <p><b>Applied On:</b> {new Date(app.createdAt).toLocaleDateString()}</p>

            <a
              href={`http://localhost:5000${app.resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-link"
            >
              View Resume
            </a>
          </div>

        </div>
      ))}
    </div>
  );
}
