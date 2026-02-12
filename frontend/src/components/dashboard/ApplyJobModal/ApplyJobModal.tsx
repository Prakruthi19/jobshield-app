import { useState } from "react";
import "./ApplyJobModal.scss";
import { uploadResume } from "../../../helper";
import { toast } from "react-hot-toast";

interface Props {
  jobId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplyJobModal({ jobId, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    resume: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.resume) return alert("Upload resume");

    setLoading(true);

    try {
    const res = await uploadResume({
      jobId,
      name: form.name,
      email: form.email,
      address: form.address,
      resume: form.resume,
    });
      onSuccess?.();   
    toast.success(res.data.message || "Application submitted successfully!");
    onClose();

  } catch (err: any) {
    toast.error(err.message || "Failed to submit application");
  } finally {
    setLoading(false);
  }
    onClose();
  };

  return (
    <div className="applyOverlay" onClick={onClose}>
      <div className="applyModal" onClick={e => e.stopPropagation()}>
        <h2>Apply for Job</h2>

        <form onSubmit={submit}>
          <input name="name" placeholder="Full Name" required onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
          <textarea name="address" placeholder="Address" required onChange={handleChange} />

          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} />

          <div className="actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
