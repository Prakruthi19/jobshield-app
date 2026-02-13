import { useEffect, useState } from "react";
import "./AdminDashboard.scss";
import { fetchAllJobs, fetchAllUsers, fetchStatstics } from "../../../api/admin";
import { logoutUser } from "../../../api/authService";
import { toast } from "react-hot-toast";

type Section = "overview" | "jobs" | "users";

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>("overview");
  const [stats, setStats] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchStatstics().then(setStats);
  }, []);

  useEffect(() => {
    if (section === "jobs") fetchAllJobs().then(setJobs);
    if (section === "users") fetchAllUsers().then(setUsers);
  }, [section]);
const handleLogout = async () => {
    try{
      const res = await logoutUser(); 
      sessionStorage.clear(); 
      console.log("Logout response:", res);  
      toast.success(res.data.message, { duration: 2000 });
      setTimeout(() => {
        window.location.href = '/'; 
      }, 2000);
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  }
  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <h2>Admin</h2>
        <button onClick={() => setSection("overview")} className={section==="overview"?"active":""}>Overview</button>
        <button onClick={() => setSection("jobs")} className={section==="jobs"?"active":""}>Jobs</button>
        <button onClick={() => setSection("users")} className={section==="users"?"active":""}>Users</button>
        <button onClick={() => handleLogout()} className="logout">Logout</button>
      </aside>

      <main className="admin__content">
        {section === "overview" && <Overview stats={stats} />}
        {section === "jobs" && <JobsTable jobs={jobs} />}
        {section === "users" && <UsersTable users={users} />}
      </main>

    </div>
  );
}

function Overview({ stats }: any) {
  if (!stats) return <p>Loading...</p>;

  return (
    <div className="overview">
      <StatCard title="Total Jobs" value={stats.jobs} />
      <StatCard title="Users" value={stats.users} />
      <StatCard title="Applications" value={stats.applications} />
      <StatCard title="Fraud Jobs" value={stats.fraud} danger />
    </div>
  );
}

function StatCard({ title, value, danger }: any) {
  return (
    <div className={`stat ${danger ? "danger" : ""}`}>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}

function JobsTable({ jobs }: any) {
  return (
    <div className="table">
      <h2>All Jobs</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Fraud %</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j: any) => (
            <tr key={j.id} className={j.mlFraudProbability > 0.7 ? "fraud" : ""}>
              <td>{j.title}</td>
              <td>{j.company?.name}</td>
              <td>{(j.mlFraudProbability * 100).toFixed(1)}%</td>
              <td>{j.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTable({ users }: any) {
  return (
    <div className="table">
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Profile Complete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: any) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.profileComplete ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
