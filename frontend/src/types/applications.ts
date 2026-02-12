export interface Company {
  id?: string;
  name?: string;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  department?: string;
  salaryRange?: string;
  company?: Company | null;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;

  name: string;
  email: string;
  address: string;
  resumeUrl: string;
  createdAt: string;

  job: Job;
}


export interface EmployerApplication {
  id: string;
  createdAt: string;
  resumeUrl: string;
  job: {
    id: string;
    title: string;
    location: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}
