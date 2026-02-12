import { useEffect, useState } from 'react';
import Header from '../../../components/dashboard/Header/Header';
import StatsGrid from '../../../components/dashboard/StatsGrid/StatsGrid';
import UserJobCard from '../../../components/dashboard/UserJobCard/UserJobCard';
import Pagination from '../../../components/dashboard/Pagination/Pagination';
import './UserDashboard.scss';
import toast from 'react-hot-toast';
import { logoutUser } from '../../../api/authService';
import SidebarUser from '../../../components/dashboard/Sidebar/SidebarUser';
import { getMyJobApplications, getAllJobs } from '../../../api/jobService';
import type { Job } from '../../../types/job';
import Profile from '../../../components/dashboard/ProfileSection/UserProfile';
import { getUserProfile, updateUserProfile } from '../../../api/userService';
import type { ProfileResponse } from "../../../types/profile";
  import { useNavigate, useSearchParams } from "react-router-dom"
import ApplyJobModal from '../../../components/dashboard/ApplyJobModal/ApplyJobModal';
import ApplicationsPage from '../../../components/dashboard/ApplicationsPage/ApplicationsPage';
import type { Application } from '../../../types/applications';
type EditableField = "firstName" | "lastName" | "phone";

type Section =
  | "activejobs"
  | "applied"
  | "saved"
  | "recommended"
  | "analytics"
  | "profile";
const sectionTitles: Record<Section, string> = {
  activejobs: "Active Jobs",
  applied: "Applied Jobs",
  saved: "Saved Jobs",
  recommended: "Recommended Jobs",
  analytics: "Trust Score",
  profile: "Job Seeker Profile",
};
export default function Dashboard() {
;
  const [params] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(params.get("tab") || "activejobs");
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileUser, setProfileUser] = useState<ProfileResponse | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const navigate = useNavigate();
useEffect(() => {
    const fetchData = async (pageNumber = 1) => {
       setLoading(true);
      try {

        const [jobsRes, userResponse, jobApplications]  = await Promise.all([
          getAllJobs({ page: pageNumber, limit: 10 , status: "all", sortBy: "updatedAt" , order: "desc" }),
          getUserProfile(),
          getMyJobApplications()
        ]);
        setJobs(jobsRes.data.data);
        setProfileUser(userResponse);
        setApplications(jobApplications.data);
        setPage(jobsRes.data.pagination.page);
        setTotalPages(jobsRes.data.pagination.totalPages);
  
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        // optional
        setLoading(false);
      }
    };
  
    fetchData(page);
  }, []);
  
  const handleApply = (jobId: string) => {
    setApplyingJobId(jobId);
  };

  const handleView = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
     navigate(`/dashboard/user/jobs/JobDetails/${jobId}`, { state: { job } });
  };


  const stats = { activejobs: jobs.length, applied:applications.length, saved: 0, recommended: 0, analytics: 0 };
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
  const updateProfile = async (
    field: EditableField,
    value: string
  ): Promise<void> => {

    if (!profileUser) return;

    const oldUser = profileUser;

    // optimistic UI update
    setProfileUser(prev => prev ? { ...prev, [field]: value } : prev);
    try{
      const res = await updateUserProfile({ [field]: value });
      toast.success(res.data.message);
    } catch (err) {
      // rollback if backend fails
      setProfileUser(oldUser);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (!profileUser) return <div>Loading user...</div>;
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
    case "activejobs":
      return (
        <>
          <StatsGrid stats={stats} />

          <div className="jobs-list-section">
            {loading && <p>Loading jobs...</p>}

            {!loading && jobs.length === 0 && (
              <p>No jobs found</p>
            )}

            {!loading && jobs.length > 0 && (
              <div className="job-list">
                {jobs.map((job: Job, idx) => (
                  <UserJobCard
                    key={job.id ?? `job-${idx}`}
                    job={job}
                    onApply={handleApply}
                    onView={handleView}
                  />
                ))}
              </div>
            )}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
            {applyingJobId && (
          <ApplyJobModal
          jobId={applyingJobId}
          onClose={() => setApplyingJobId(null)}
          onSuccess={() => {
            setApplyingJobId(null);
          }}
        />
          )}
        </>
      );

    case "applied":
      return <ApplicationsPage applications={applications} />;

    default:
      return <div>Select a section</div>;
  }
};

  return (
    <div className="dashboard">
      <SidebarUser
        user={profileUser || { firstName: "Loading...", lastName: "", email: "", phone: "", role: "" }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        stats={stats}
        handleLogout={handleLogout}
      />
      <main className="main-content">
        <Header 
          title={sectionTitles[activeSection as Section] || "dashboard"} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        <div className="content">
          <div className="content-section">
            {renderSection()}
          </div>
        </div>
      </main>
    </div>
  );
}
