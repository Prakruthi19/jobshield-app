import React, { useState } from "react";
import "./UserProfile.scss";
import type { ProfileResponse } from "../../../types/profile";
type EditableField = "firstName" | "lastName" | "phone";
type Props = {
  user: ProfileResponse;
onUpdate: (field: EditableField, value: string) => Promise<void>;
};

const Profile: React.FC<Props> = ({ user, onUpdate }) => {
  const [editField, setEditField] = useState<EditableField | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = (field: EditableField) => {
    setEditField(field);
    setTempValue(user[field]);
  };
const validate = (field: EditableField, value: string): string | null => {
  const v = value.trim();

  if (field === "firstName" || field === "lastName") {
    if (!v) return "This field is required";
    if (v.length < 2) return "Must be at least 2 characters";
    if (!/^[A-Za-z]+$/.test(v)) return "Only letters allowed";
  }

  if (field === "phone") {
    if (!/^[0-9]{10}$/.test(v)) return "Phone must be 10 digits";
  }

  return null;
};
  const saveEdit = async () => {
    if (!editField) return;

    setLoading(true);
    const error = validate(editField, tempValue);
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    setError(null);
    await onUpdate(editField, tempValue);
    setLoading(false);

    setEditField(null);
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2 className="title">Profile Details</h2>

        <ProfileRow label="Email" value={user.email} readonly />

        <ProfileRow
           label="First Name"
            value={user.firstName}
            editable
            isEditing={editField === "firstName"}
            tempValue={tempValue}
            error={error}
            setTempValue={setTempValue}
            onEdit={() => startEdit("firstName")}
            onSave={saveEdit}
            loading={loading}
            onCancel={() => setEditField(null)}
        />
        <ProfileRow
        label="Last Name"
        value={user.lastName}
        editable
        isEditing={editField === "lastName"}
        tempValue={tempValue}
        error={error}
        setTempValue={setTempValue}
        onEdit={() => startEdit("lastName")}
        onSave={saveEdit}
        loading={loading}
        onCancel={() => setEditField(null)}
        />

        <ProfileRow
          label="Phone Number"
          value={user.phone}
          editable
          isEditing={editField === "phone"}
          tempValue={tempValue}
          error={error}
          setTempValue={setTempValue}
          onEdit={() => startEdit("phone")}
          onSave={saveEdit}
          loading={loading}
          onCancel={() => setEditField(null)}
        />

        <ProfileRow label="Account Type" value={user.role} readonly />
      </div>
    </div>
  );
};

export default Profile;

/* ---------- Row Component ---------- */

type RowProps = {
  label: string;
  value: string;
  editable?: boolean;
  readonly?: boolean;
  isEditing?: boolean;
  tempValue?: string;
  error?: string | null;
  setTempValue?: (v: string) => void;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  loading?: boolean;
};

const ProfileRow: React.FC<RowProps> = ({
  label,
  value,
  editable,
  readonly,
  isEditing,
  tempValue,
  error,
  setTempValue,
  onEdit,
  onSave,
  onCancel,
  loading,
}) => {
  return (
    <div className="profile-row">
      <div className="label">{label}</div>

      <div className="value">
        {isEditing ? (
          <>
            <input
              value={tempValue}
              onChange={(e) => setTempValue?.(e.target.value)}
            />
            {error && <div className="error">{error}</div>}
            <button className="save" onClick={onSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button className="cancel" onClick={onCancel}>Cancel</button>
          </>
        ) : (
          <>
            <span>{value}</span>
            {editable && !readonly && <button className="edit" onClick={onEdit}>Edit</button>}
          </>
        )}
      </div>
    </div>
  );
};
