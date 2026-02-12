import api from "./api";
// User registration
export const getMyCompanies = async () => {
  const token = sessionStorage.getItem("accessToken");
  return api.get("/api/companies/my-companies", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const createCompany = async (companyData: any) => {
  const token = sessionStorage.getItem("accessToken");
  return api.post("/api/companies/create", companyData, {  
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

