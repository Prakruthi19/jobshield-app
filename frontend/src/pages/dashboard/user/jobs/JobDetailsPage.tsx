import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Job } from "../../../../types/job";
import  JobDetails from "../../../../components/dashboard/Jobs/JobDetails";
import { getJobById } from "../../../../api/jobService";
const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [job, setJob] = useState<Job | null>(location.state?.job ?? null);

  useEffect(()=> {
   if (!id || job) return;

  const fetchJob = async () => {
    try {
      const res = await getJobById(id);
      setJob(res.data.data);
      console.log("Fetched job details:", res.data.data);
    } catch (err) {
      console.error("Error fetching job details:", err);
    }
  };

  fetchJob();
}, [id]);
  if (!job) return <div>Loading...</div>;

  return (
    <JobDetails
      job={job}
      onClose={() => window.history.back()}
    />
  );
};

export default JobDetailsPage;
