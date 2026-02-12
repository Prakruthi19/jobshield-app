import type { Job, JobFormData } from "./types/job";

export const mapJobToFormData = (job: Job): JobFormData => ({
  title: job.title ?? "",
  location: job.location ?? "",
  department: job.department ?? "",
  salaryRange: job.salaryRange ?? "",
  companyProfile: job.companyProfile ?? "",
  description: job.description ?? "",
  requirements: job.requirements ?? "",
  benefits: job.benefits ?? "",
  telecommuting: job.telecommuting ?? 0,
  hasCompanyLogo: job.hasCompanyLogo ?? 0,
  hasQuestions: job.hasQuestions ?? 0,
  employmentType: job.employmentType ?? "",
  requiredExperience: job.requiredExperience ?? "",
  requiredEducation: job.requiredEducation ?? "",
  industry: job.industry ?? "",
  function: job.function ?? "",
});




export interface UploadResumeParams {
  jobId: string;
  name: string;
  email: string;
  address: string;
  resume: File;
}

export const uploadResume = async ({
  jobId,
  name,
  email,
  address,
  resume,
}: UploadResumeParams) => {

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("address", address);
  formData.append("resume", resume);
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(`http://localhost:5000/api/jobs/applications/${jobId}`, {

    method: "POST",
    body: formData,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = "Failed to submit application";
    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      message = await response.text();
    }
    throw new Error(message);
  }

  return response.json();
};
