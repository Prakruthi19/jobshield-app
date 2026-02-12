import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./createJobForm.scss";
import toast from "react-hot-toast";
import type { JobFormData } from "../../../types/job";



interface JobFormProps {
  initialData?: JobFormData;
  onSubmit: (data: JobFormData) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit, onClose, isSubmitting, initialData }) => {
  const [form, setForm] = useState<JobFormData>({
    title: "",
    location: "",
    department: "",
    salaryRange: "",
    companyProfile: "",
    description: "",
    requirements: "",
    benefits: "",
    telecommuting: 0,
    hasCompanyLogo: 0,
    hasQuestions: 0,
    employmentType: "",
    requiredExperience: "",
    requiredEducation: "",
    industry: "",
    function: "",
  });
  useEffect(() => {
  if (initialData) {
    setForm(initialData);
  }
}, [initialData]);
  const isEdit = !!initialData;
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let { name, value, type } = e.target as HTMLInputElement;

    // special cases for checkbox fields
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      value = checked ? "1" : "0";
    }

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? Number(value) : value,
    }));
  };

  const submit = (e: FormEvent) => {
    
  const { title, description, companyProfile, industry, employmentType, requiredExperience, requiredEducation } = form;

  if (!title || !description || !companyProfile || !industry || !employmentType || !requiredExperience || !requiredEducation) {
    toast.error("Please fill in all required fields.");
  }

    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="job-form-container">
      <h2>Create Job Posting</h2>
      <form onSubmit={submit} className="job-form">

       <input name="title" value={form.title} placeholder="Job Title" onChange={handleChange} />
        <input name="location" value={form.location} placeholder="Location (Remote / NYC / etc)" onChange={handleChange} />

        <input name="department" value={form.department} placeholder="Department (e.g. Engineering)" onChange={handleChange} />

        <input name="salaryRange" value={form.salaryRange} placeholder="Salary Range (e.g. 80000-120000)" onChange={handleChange} />

        <textarea name="companyProfile" value={form.companyProfile} placeholder="Company Profile" rows={3} onChange={handleChange} />

        <textarea name="description" value={form.description} placeholder="Job Description" rows={4} onChange={handleChange} />

        <textarea name="requirements" value={form.requirements} placeholder="Job Requirements" rows={3} onChange={handleChange} />

        <textarea name="benefits" value={form.benefits} placeholder="Benefits" rows={3} onChange={handleChange} />

        <label>
         <input type="checkbox" name="telecommuting" checked={!!form.telecommuting} onChange={handleChange} />
          Telecommuting
        </label>

        <label>
          <input type="checkbox" name="hasCompanyLogo" checked={!!form.hasCompanyLogo} onChange={handleChange} /> Has Company Logo
        </label>

        <label>
          <input type="checkbox" name="hasQuestions" checked={!!form.hasQuestions} onChange={handleChange} /> Has Screening Questions
        </label>

    <div className="form-group">
  <label>Employment Type</label>
  <select name="employmentType" value={form.employmentType} onChange={handleChange}>
    <option value="">Select Type</option>
    <option value="Full-time">Full-time</option>
    <option value="Part-time">Part-time</option>
    <option value="Contract">Contract</option>
    <option value="Other">Other</option>
  </select>
</div>

<div className="form-group">
  <label>Required Experience</label>
  <select name="requiredExperience" value={form.requiredExperience} onChange={handleChange}>
    <option value="">Select experience</option>
    <option value="Internship">Internship</option>
    <option value="Entry level">Entry level</option>
    <option value="Mid level">Mid level</option>
    <option value="Senior level">Senior level</option>
    <option value="Executive">Executive</option>
  </select>
</div>

<div className="form-group">
  <label>Required Education</label>
  <select name="requiredEducation" value={form.requiredEducation} onChange={handleChange}>
    <option value="">Select education</option>
    <option value="High School">High School or equivalent</option>
    <option value="Associate Degree">Associate Degree</option>
    <option value="Bachelor's Degree">Bachelor's Degree</option>
    <option value="Master's Degree">Master's Degree</option>
    <option value="Doctorate">Doctorate</option>
    <option value="None">None</option>
  </select>
</div>

            <div className="form-group">
            <label>Industry</label>
            <select name="industry" value={form.industry} onChange={handleChange}>
    <option value="">Select industry</option>
    <option value="Accounting">Accounting</option>
    <option value="Automotive">Automotive</option>
    <option value="Computer Software">Computer Software</option>
    <option value="Design">Design</option>
    <option value="Education Management">Education Management</option>
    <option value="Farming">Farming</option>
    <option value="Financial Services">Financial Services</option>
    <option value="Gambling & Casinos">Gambling & Casinos</option>
    <option value="Health, Wellness and Fitness">Health, Wellness and Fitness</option>
    <option value="Information Technology and Services">Information Technology and Services</option>
    <option value="Insurance">Insurance</option>
    <option value="Legal Services">Legal Services</option>
    <option value="Logistics and Supply Chain">Logistics and Supply Chain</option>
    <option value="Marketing and Advertising">Marketing and Advertising</option>
    <option value="Primary/Secondary Education">Primary/Secondary Education</option>
    <option value="Telecommunications">Telecommunications</option>
  </select>
            </div>

<div className="form-group">
  <label>Function</label>
        <select name="function" value={form.function} onChange={handleChange}>
    <option value="">Select function</option>
    <option value="Administrative">Administrative</option>
    <option value="Business Development">Business Development</option>
    <option value="Customer Service">Customer Service</option>
    <option value="Design">Design</option>
    <option value="Education">Education</option>
    <option value="Engineering">Engineering</option>
    <option value="Health Care Provider">Health Care Provider</option>
    <option value="Information Technology">Information Technology</option>
    <option value="Management">Management</option>
    <option value="Marketing">Marketing</option>
    <option value="Other">Other</option>
    <option value="Product Management">Product Management</option>
    <option value="Production">Production</option>
    <option value="Sales">Sales</option>
    <option value="Supply Chain">Supply Chain</option>
  </select>
        </div> 

        <div className="job-form-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-btn" disabled={isSubmitting}>{isSubmitting
    ? (isEdit ? "Updating Job..." : "Creating Job...")
    : (isEdit ? "Update Job" : "Create Job")}</button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
