import api from "./api";

export const createJob = async (jobData: any) => {
  const token = sessionStorage.getItem("accessToken");
  return api.post("/api/jobs/createJob", jobData, { 
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },

    });
};

export const getMyJobs = async (queryParams?: any) => {
  const token = sessionStorage.getItem("accessToken");

  return api.get("/api/jobs/getMyJobs", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    params: queryParams,   
  });
};

export const getAllJobs = async (queryParams?: any) => {
  const token = sessionStorage.getItem("accessToken");

  return api.get("/api/jobs/getJobs", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    params: queryParams,   
  });
};


export const deleteJob = async (jobId: string) => {
  const token = sessionStorage.getItem("accessToken");
  return api.delete(`/api/jobs/deleteJob/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};


export const getJobById = async (jobId: string) => {
  const token = sessionStorage.getItem("accessToken");
  return api.get(`/api/jobs/getJobs/${jobId}`, { 
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },
    });
};

export const updateJob = async (jobId: string, jobData: any) => {
  const token = sessionStorage.getItem("accessToken");
  return api.put(`/api/jobs/updateJob/${jobId}`, jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}



export const fetchMyApplications = async (userId: string) => {
  const token = sessionStorage.getItem("accessToken");
  return api.get(`/api/jobs/applications/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};