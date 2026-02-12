export type Company = {
  id: string;
  name: string;
  slug: string;

  description: string | null;
  industry: string | null;
  companySize: string | null; // enum or null
  foundedYear: number | null;

  websiteUrl: string | null;
  email: string | null;
  phone: string | null;

  headquartersLocation: string | null;
  headquartersCountry: string | null;

  hasCompanyLogo: 0 | 1;
  coverImageUrl: string | null;
  linkedinUrl: string | null;

  status: string;             // enum from backend
  isVerified: boolean;
  verificationDate: string | null; // Date converted to ISO
  verificationDocuments: any | null;

  createdByUserId: string | null;

  createdAt: string;          // ISO string
  updatedAt: string;          // ISO string
};
