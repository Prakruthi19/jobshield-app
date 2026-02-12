import React, { useState } from 'react';
import { Building2, Globe, MapPin, Users, Briefcase, Phone, Mail, X } from 'lucide-react';
import "./createCompanyForm.scss"

export default function CreateCompanyForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => Promise<any> }) {
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    linkedinUrl: null,
    industry: '',
    headquartersLocation: '',
    headquartersCountry: '',
    companySize: '',
    foundedYear: null,
    email: '',
    phone: '',
    description: '',
    hasCompanyLogo: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    const requiredFields = {
      name: 'Company Name',
      description: 'Company Description',
      industry: 'Industry',
      companySize: 'Company Size',
      headquartersLocation: 'Headquarters Location',
      headquartersCountry: 'Country',
      websiteUrl: 'Website URL'
    };

for (const [field, label] of Object.entries(requiredFields)) {
  const value = formData[field as keyof typeof formData];

    // null/undefined check
    if (value === null || value === undefined || value === '') {
      setError(`${label} is required`);
      return;
    }

    // string-only trim check
    if (typeof value === 'string' && value.trim() === '') {
      setError(`${label} is required`);
      return;
    }
  }


    setLoading(true);

    try {
      await onSubmit(formData);
      onClose?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="create-company-modal">
      <div className="modal-container">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Create New Company</h2>
            <p className="modal-subtitle">Fill in the details about your company</p>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">

          {error && <div className="error-box">{error}</div>}

          <div className="form-sections">

            {/* Basic Info */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>

              <div className="form-field">
                <label>Company Name<span className="required">*</span></label>
                <div className="field-icon-wrapper">
                  <Building2 size={20} className="field-icon" />
                  <input type="text" name="name" required value={formData.name}
                    onChange={handleChange} placeholder="TechCorp Inc" />
                </div>
              </div>

              <div className="form-field">
                <label>Company Description</label>
                <textarea required name="description" value={formData.description}
                  onChange={handleChange} placeholder="Tell us about your company..." />
              </div>
            </div>

            {/* Company Details */}
            <div className="form-section">
              <h3 className="section-title">Company Details</h3>

              <div className="grid-2">
                <div className="form-field">
                  <label>Industry</label>
                  <div className="field-icon-wrapper">
                    <Briefcase size={20} className="field-icon" />
                    <select required name="industry" value={formData.industry} onChange={handleChange}>
                      <option value="">Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>Company Size</label>
                  <div className="field-icon-wrapper">
                    <Users size={20} className="field-icon" />
                    <select required name="companySize" value={formData.companySize} onChange={handleChange}>
                      <option value="">Select Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1001-5000">1001-5000 employees</option>
                      <option value="5000+">5000+ employees</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="form-section">
              <h3 className="section-title">Location</h3>
              <div className="grid-2">
                <div className="form-field">
                  <label>Headquarters Location</label>
                  <div className="field-icon-wrapper">
                    <MapPin size={20} className="field-icon" />
                    <input required type="text" name="headquartersLocation"
                      value={formData.headquartersLocation} onChange={handleChange}
                      placeholder="San Francisco, CA" />
                  </div>
                </div>

                <div className="form-field">
                  <label>Country</label>
                  <input required type="text" name="headquartersCountry"
                    value={formData.headquartersCountry} onChange={handleChange}
                    placeholder="United States" />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="form-section">
              <h3 className="section-title">Contact Information</h3>
              <div className="grid-2">

                <div className="form-field">
                  <label>Email</label>
                  <div className="field-icon-wrapper">
                    <Mail size={20} className="field-icon" />
                    <input type="email" name="email" value={formData.email}
                      onChange={handleChange} placeholder="contact@company.com" />
                  </div>
                </div>

                <div className="form-field">
                  <label>Phone</label>
                  <div className="field-icon-wrapper">
                    <Phone size={20} className="field-icon" />
                    <input type="tel" name="phone" value={formData.phone}
                      onChange={handleChange} placeholder="+1 (555) 123-4567" />
                  </div>
                </div>

              </div>
            </div>

            {/* Social Links */}
            <div className="form-section">
              <h3 className="section-title">Online Presence</h3>
                <div className="form-field">
  <label>Website URL</label>
  <div className="field-icon-wrapper">
    <Globe size={20} className="field-icon" />
    <input
      required
      type="url"
      name="websiteUrl"
      value={formData.websiteUrl}
      onChange={handleChange}
      placeholder="https://company.com"
    />
  </div>
</div>

<div className="form-field">
  <label>LinkedIn URL</label>
  <div className="field-icon-wrapper">
    <Globe size={20} className="field-icon" /> {/* can replace with LinkedIn icon if you want */}
    <input
      type="url"
      name="linkedinUrl"
      value={formData.linkedinUrl ?? ''}
      onChange={handleChange}
      placeholder="https://linkedin.com/company/yourcompany"
    />
  </div>
</div>

<div className="form-field">
  <label>Has Company Logo?</label>
  <label className="checkbox-label">
    <input
      type="checkbox"
      name="hasCompanyLogo"
      checked={formData.hasCompanyLogo === 1}
      onChange={(e) => {
      setFormData(prev => ({
        ...prev,
        hasCompanyLogo: e.target.checked ? 1 : 0,
      }));
    }}
    />
    Yes
  </label>
</div>
             
             
               
            </div>
          </div>

          {/* Footer */}
          <div className="modal-actions">
            <button onClick={handleSubmit} disabled={loading || !formData.name || !formData.description || !formData.industry || !formData.companySize || !formData.headquartersLocation || !formData.headquartersCountry || !formData.websiteUrl}
              className={`submit-btn ${loading ? 'disabled' : ''}`}>
              {loading ? 'Creating...' : 'Create Company'}
            </button>
            <button onClick={onClose} className="cancel-btn">Cancel</button>
          </div>

        </div>
      </div>
    </div>
  );
}
