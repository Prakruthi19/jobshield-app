import { useEffect, useState } from "react";
import "./EditJobModal.scss";

export interface JobFormData {
  title?: string;
  location?: string;
  department?: string;
  employmentType?: string;
  telecommuting?: number;
  salaryRange?: string;
  requiredExperience?: string;
  requiredEducation?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  companyProfile?: string;
  industry?: string;
  function?: string;
}

interface Props {
  job: JobFormData;
  onClose: () => void;
  onSave: (data: JobFormData) => Promise<void>;
}

export default function EditJobModal({ job, onClose, onSave }: Props) {
  const [form, setForm] = useState<JobFormData>(job);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? Number((e.target as HTMLInputElement).checked) : value
    }));
  };

  const submit = async () => {
    setLoading(true);
    await onSave(form);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalCard" onClick={e => e.stopPropagation()}>
        <header>
          <h2>Edit Job</h2>
          <button className="closeBtn" onClick={onClose}>×</button>
        </header>

        <div className="modalBody">

          {/* BASIC INFO */}
          <section>
            <h3>Basic Info</h3>
            <input name="title" value={form.title || ""} onChange={handleChange} placeholder="Job Title" />
            <input name="location" value={form.location || ""} onChange={handleChange} placeholder="Location" />
            <input name="department" value={form.department || ""} onChange={handleChange} placeholder="Department" />

            <select name="employmentType" value={form.employmentType || ""} onChange={handleChange}>
              <option value="">Employment Type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>

            <label className="checkbox">
              <input
                type="checkbox"
                name="telecommuting"
                checked={!!form.telecommuting}
                onChange={handleChange}
              />
              Remote Allowed
            </label>
          </section>

          {/* SALARY */}
          <section>
            <h3>Compensation</h3>
            <input name="salaryRange" value={form.salaryRange || ""} onChange={handleChange} placeholder="Salary Range" />
            <input name="requiredExperience" value={form.requiredExperience || ""} onChange={handleChange} placeholder="Experience" />
            <input name="requiredEducation" value={form.requiredEducation || ""} onChange={handleChange} placeholder="Education" />
          </section>

          {/* DESCRIPTION */}
          <section>
            <h3>Description</h3>
            <textarea name="description" value={form.description || ""} onChange={handleChange} placeholder="Job Description" />
            <textarea name="requirements" value={form.requirements || ""} onChange={handleChange} placeholder="Requirements" />
            <textarea name="benefits" value={form.benefits || ""} onChange={handleChange} placeholder="Benefits" />
          </section>

          {/* COMPANY */}
          <section>
            <h3>Company</h3>
            <textarea name="companyProfile" value={form.companyProfile || ""} onChange={handleChange} placeholder="Company Profile" />
          </section>

          {/* CATEGORY */}
          <section>
            <h3>Category</h3>
            <input name="industry" value={form.industry || ""} onChange={handleChange} placeholder="Industry" />
            <input name="function" value={form.function || ""} onChange={handleChange} placeholder="Function" />
          </section>

        </div>

        <footer>
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="save" onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </footer>
      </div>
    </div>
  );
}
