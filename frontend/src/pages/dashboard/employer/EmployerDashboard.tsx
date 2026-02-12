import React, { useEffect, useState } from 'react'

import { createCompany, getMyCompanies } from '../../../api/companyService';
import './EmployerDashboard.scss';
import CreateCompanyForm from '../../../components/dashboard/CreateCompanyForm/createCompanyForm';
import toast from 'react-hot-toast';
import Header from '../../../components/dashboard/Header/Header';
import { logoutUser } from '../../../api/authService';
import SidebarEmployee from '../../../components/dashboard/Sidebar/SidebarEmployee';
import CreateJobForm from '../../../components/dashboard/CreateJobForm/createJobForm';
import { createJob, deleteJob, getMyJobs, updateJob } from '../../../api/jobService';
import EmployerJobs from '../../../components/dashboard/ContentSection/EmployerJobs';
import type { ProfileResponse } from '../../../types/profile';
import { getUserProfile, updateUserProfile } from '../../../api/userService';
import Profile from '../../../components/dashboard/ProfileSection/UserProfile';
type EditableField = "firstName" | "lastName" | "phone";
const EmployerDashboard = () => {

  const sizeMap = {
  "1-10": "SIZE_1_10",
  "11-50": "SIZE_11_50",
  "51-200": "SIZE_51_200",
  "201-500": "SIZE_201_500",
  "501-1000": "SIZE_501_1000",
  "1001-5000": "SIZE_1001_5000",
  "5000+": "SIZE_5000_PLUS",
} as const;
type Section =
  | "openjobs"
  | "jobapplications"
  | "profile"
  | "closedjobs";
const sectionTitles: Record<Section, string> = {
  openjobs: "Active Jobs",
  jobapplications: "Job Applications",
  profile: "Employer Profile",
  closedjobs: "Closed Jobs",
};
  const [companies, setCompanies] = React.useState<Array<any>>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('openjobs');
    const [showJobForm, setShowJobForm] = useState(false);
    const [jobs, setJobs] = useState<Array<any>>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [closedJobs, setClosedJobs] = useState<Array<any>>([]);
  const [profileUser, setProfileUser] = useState<ProfileResponse | null>(null);
      const handleLogout = async () => {
    try{
      // Call logout API
      const res = await logoutUser(); 
      // Clear session storage
      sessionStorage.clear();   
      // Redirect to login page

      window.location.href = '/'; 
      toast.success(res.data.message, { duration: 2000 });
      
     
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
};
useEffect(() => {
  const fetchData = async () => {
    try {

      const [companiesRes, jobsRes, closedJobRes, profileRes] = await Promise.all([
        getMyCompanies(),
        getMyJobs({ page: 1, limit: 10 , status: "ACTIVE"}),
        getMyJobs({ page: 1, limit: 10 , status: "CLOSED"}),
        getUserProfile(sessionStorage.getItem("userId") || "")
      ]);
      
      setJobs(jobsRes.data.data);
      setProfileUser(profileRes);
      setClosedJobs(closedJobRes.data.data);
        if (jobsRes.data.data.length >= 1) {
          console.log("Hiding job form as jobs exist");
        setShowJobForm(false);
      } else {
        setShowJobForm(true);
      }
      setCompanies(companiesRes.data.data);
      console.log("Companies data:", companiesRes.data);
      console.log("Jobs data:", jobsRes.data);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      // optional
      // setLoading(false);
    }
  };

  fetchData();
}, []);

const handleJobSubmit = async (data: any) => {
    const payload = {
    ...data,
    companyId: companies[0].id, // Assuming the first company is selected
    postedByUserId: sessionStorage.getItem("userId"),
  };
  console.log("Payload for job creation:", payload);
  try{
    setIsSubmitting(true);
  const res = await createJob(payload);
  toast.success(res.data.message || "Job created successfully!");
  setShowJobForm(false);
    console.log("Job created with data:", res);
    // Refresh job list
    const jobsRes = await getMyJobs({ page: 1, limit: 10 });
    setJobs(jobsRes.data.data);
  } catch (error) {
    toast.error("Error creating job. Please try again.");
    console.error("Error creating job:", error);
  }
  finally{
      setIsSubmitting(false);
  }
}

  const handleSubmit = async (formData: any) => {
    try {
      const payload = {
    ...formData,
    companySize: sizeMap[formData.companySize as keyof typeof sizeMap],   
  };
          const res = await createCompany(payload);

        setCompanies(prev => [...prev, res.data.company]);

        setShowForm(false);

        toast.success(res.data.message || "Company created successfully!");
        
        return res.data.company;
    } catch (err: any) {
      toast.error(err.message || "Error creating company");
      throw err;
    }
  };
  const [showForm, setShowForm] = useState(false);
const handleDeleteJob = async (jobId: string) => {
    try {

      console.log("Deleting job with ID:", jobId);
      await deleteJob(jobId);
    
      const jobsRes = await getMyJobs({ page: 1, limit: 10 });
      setJobs(jobsRes.data.data);
      toast.success(jobsRes.data.message || "Job deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete job. Please try again.");
    }
  }

  const handleUpdateJob = async (jobId: string, updatedData: any) => {
    try {
      // Call update job API (not implemented in this snippet)
      await updateJob(jobId, updatedData);
      // Refresh job list
      console.log("Updating job with ID:", jobId, "and data:", updatedData);
      const jobsRes = await getMyJobs({ page: 1, limit: 10 });
      setJobs(jobsRes.data.data);
      toast.success("Job updated successfully!");
    } catch (err) {
      toast.error("Failed to update job. Please try again.");
    }
  };

  const updateProfile = async (
    field: EditableField,
    value: string
  ): Promise<void> => {

    if (!profileUser) return;

    const oldUser = profileUser;


    setProfileUser(prev => prev ? { ...prev, [field]: value } : prev);
    try{
      const res = await updateUserProfile(sessionStorage.getItem("userId") || "", { [field]: value });
      toast.success(res.data.message);
    } catch (err) {

      setProfileUser(oldUser);
      toast.error("Failed to update profile. Please try again.");
    }
  };


const renderSection = () => {
  switch (activeSection) {
    case "profile":
       if (!profileUser) return <div>Loading profile...</div>;
      return (
        <Profile
          user={profileUser}
          onUpdate={updateProfile}
        />
      );
    case "dashboard":
    case "openjobs":
      if (showJobForm) {
      return (
      <CreateJobForm
      isSubmitting={isSubmitting}
      onSubmit={handleJobSubmit}
      onClose={() => setShowJobForm(false)}
        />
      );
    }
    if (jobs.length > 0) {
      return (
        <>
        <div className="jobs-header">
        <button
          className="primary-btn"
          onClick={() => setShowJobForm(true)}
        >
          Create Job
        </button>
      </div>

      <EmployerJobs jobsList={jobs} onDeleteJob={handleDeleteJob} onUpdateJob={handleUpdateJob} />
        </>
      )
    }
     return (
        <div className="empty-state">
          <h3>No jobs posted yet</h3>
          <p>Create a job posting for applicants and ML scoring</p>
          <button
            className="primary-btn"
            onClick={() => setShowJobForm(true)}
          >
            Create Job
          </button>
        </div>
      );

    case "closedjobs":
      if (closedJobs.length > 0) {
          return (
            <>
            <div className="jobs-header">
            <button
              className="primary-btn"
              onClick={() => setShowJobForm(true)}
            >
              Create Job
            </button>
          </div>

          <EmployerJobs jobsList={closedJobs} onDeleteJob={handleDeleteJob} onUpdateJob={handleUpdateJob}/>
            </>
          )
    }
    return (
        <div className="empty-state">
          <h3>No Closed Jobs</h3>
        </div>
      );
    default:
      return <div>Select a section</div>;
    }
  }
if (!companies || companies.length === 0) {
  return (
    <>
      {!showForm ? (
        <div className="empty-state">
          <h2>No Companies Found</h2>
          <p>Create a company to start managing jobs and employees.</p>
          <button
            onClick={() => setShowForm(true)}
            className="create-btn"
          >
            Create Company
          </button>
        </div>
      ) : (
        <CreateCompanyForm
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
 
return (
  <div className="dashboard-container">

    <SidebarEmployee
      user={profileUser || { firstName: "Loading...", lastName: "", email: "", phone: "", role: "" }}
      isOpen={isSidebarOpen}
      setIsOpen={setIsSidebarOpen}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      stats={{ openJobs: jobs.length, jobApplications: 0}}
      handleLogout={handleLogout}
    />

    <main className="main-content">
      <Header
        title={sectionTitles[activeSection as Section] || "dashboard"} 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
        <div className="content">
        {renderSection()}
          </div>
    </main>
  </div>
);

}

export default EmployerDashboard;
