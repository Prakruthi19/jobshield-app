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
import type { EmployerApplication } from '../../../types/applications';
import type { Job } from '../../../types/job';
import { fetchEmployerApplications } from '../../../api/applications';
import EmployerApplicationsPage from '../../../components/dashboard/EmployerApplicationsPage/EmployerApplicationsPage';
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
type UIState = {
  sidebarOpen: boolean;
  activeSection: Section;
  showJobForm: boolean;
  isSubmitting: boolean;
};
  const [companies, setCompanies] = React.useState<Array<any>>([]);
const [ui, setUI] = useState<UIState>({
  sidebarOpen: true,
  activeSection: "openjobs",
  showJobForm: false,
  isSubmitting: false,
});
const [jobs, setJobs] = useState<Job[]>([]);
const [closedJobs, setClosedJobs] = useState<Job[]>([]);
const [applications, setApplications] = useState<EmployerApplication[]>([]);
const [profileUser, setProfileUser] = useState<ProfileResponse | null>(null);
      const handleLogout = async () => {
    try{
      const res = await logoutUser(); 
      sessionStorage.clear();   
      window.location.href = '/'; 
      toast.success(res.data.message, { duration: 2000 });
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
};
useEffect(() => {
  const fetchData = async () => {
    try {

      const [companiesRes, jobsRes, closedJobRes, profileRes, applicationsRes] = await Promise.all([
        getMyCompanies(),
        getMyJobs({ page: 1, limit: 10 , status: "ACTIVE"}),
        getMyJobs({ page: 1, limit: 10 , status: "CLOSED"}),
        getUserProfile(),
        fetchEmployerApplications()
      ]);
      
      setJobs(jobsRes.data.data);
      setProfileUser(profileRes);
      setClosedJobs(closedJobRes.data.data);
      setApplications(applicationsRes.data);
        if (jobsRes.data.data.length >= 1) {
          console.log("Hiding job form as jobs exist");
        setUI(prev => ({ ...prev, showJobForm: false }));
      } else {
        setUI(prev => ({ ...prev, showJobForm: true }));
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
    setUI(prev => ({ ...prev, isSubmitting: true }));
  const res = await createJob(payload);
  toast.success(res.data.message || "Job created successfully!");
  setUI(prev => ({ ...prev, showJobForm: false, isSubmitting: false }));
    console.log("Job created with data:", res);
    // Refresh job list
    const jobsRes = await getMyJobs({ page: 1, limit: 10 });
    setJobs(jobsRes.data.data);
  } catch (error) {
    toast.error("Error creating job. Please try again.");
    console.error("Error creating job:", error);
  }
  finally{
      setUI(prev => ({ ...prev, isSubmitting: false }));
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
      const res = await updateUserProfile({ [field]: value });
      toast.success(res.data.message);
    } catch (err) {

      setProfileUser(oldUser);
      toast.error("Failed to update profile. Please try again.");
    }
  };

const toggleSidebar = () => {
  setUI(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
};
const renderSection = () => {
  switch (ui.activeSection) {
    case "profile":
       if (!profileUser) return <div>Loading profile...</div>;
      return (
        <Profile
          user={profileUser}
          onUpdate={updateProfile}
        />
      );
    case "openjobs":
      if (ui.showJobForm) {
      return (
      <CreateJobForm
      isSubmitting={ui.isSubmitting}
      onSubmit={handleJobSubmit}
      onClose={() => setUI(prev => ({ ...prev, showJobForm: false }))}
        />
      );
    }
    if (jobs.length > 0) {
      return (
        <>
        <div className="jobs-header">
        <button
          className="primary-btn"
          onClick={() => setUI(prev => ({ ...prev, showJobForm: true }))}
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
            onClick={() => setUI(prev => ({ ...prev, showJobForm: true }))}
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
              onClick={() => setUI(prev => ({ ...prev, showJobForm: true }))}
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
      case "jobapplications":
      return <EmployerApplicationsPage jobApplications={applications} />;
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
      isOpen={ui.sidebarOpen}
      setIsOpen={toggleSidebar}
      activeSection={ui.activeSection}
      setActiveSection={(section: Section) => setUI(prev => ({ ...prev, activeSection: section }))}
      stats={{ openJobs: jobs.length, jobApplications: applications.length, closedJobs: closedJobs.length }}
      handleLogout={handleLogout}
    />

    <main className="main-content">
      <Header
        title={sectionTitles[ui.activeSection as Section] || "dashboard"} 
         isSidebarOpen={ui.sidebarOpen}
        setIsSidebarOpen={toggleSidebar}
      />
        <div className="content">
        {renderSection()}
          </div>
    </main>
  </div>
);

}

export default EmployerDashboard;
