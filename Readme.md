# JobShield: Fake Job Detection & Hiring Platform

A full-stack job portal that protects candidates from fraudulent job postings using Machine Learning while providing employers with a clean ATS-style hiring dashboard.

JobShield combines a modern job board + resume submission system + fraud detection engine trained on real job posting data.

---

## Features

### For Job Seekers

* Browse verified job listings
* Apply with resume upload (PDF / DOCX)
* Track applied jobs
* Secure profile system
* Protection from fake job scams using ML predictions

### For Employers

* Create & manage job postings
* View applicants in recruiter dashboard
* Download resumes
* Close / update jobs
* Real-time applications inbox

### Fraud Detection AI

* Predicts fake vs real job postings
* Assigns trust score to each job
* Automatically flags suspicious listings

---

## Google Single Sign-On (SSO)

JobShield supports secure login using Google OAuth.

Users can sign in without creating a password, improving both security and usability.

### How it works

1. User clicks Continue with Google
2. Google authenticates the user
3. Backend verifies Google ID token
4. If user exists → login
   If not → account automatically created
5. JWT session issued

### Benefits

* No password management
* Reduced fake accounts
* Faster onboarding
* Secure authentication handled by Google

The system also supports traditional email/password login, allowing flexible authentication methods.

---

## Machine Learning Model

The fraud detection model is trained using real job posting data.

Dataset:
https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction/data

Training Notebook (Google Colab):
https://colab.research.google.com/drive/1VDXq3BEHAvIZqqWlhnunbRAKYPedk6fV#scrollTo=3ada2dc7

The model analyzes:

* Job description
* Company profile
* Salary patterns
* Required experience
* Benefits text
* Metadata patterns

Output:
Fraud Probability Score (0 → 1)
Trust Score (0 → 100)

---

## Tech Stack

### Frontend

* React + TypeScript
* SCSS Styling
* Responsive Dashboard UI

### Backend

* Node.js + Express
* Prisma ORM
* REST API Architecture
* JWT Authentication
* Google OAuth Authentication

### Database

* PostgreSQL

### Storage

* Resume uploads stored locally (Firebase ready architecture)

### AI

* Python
* NLP preprocessing
* Classification model

---

## Project Structure

```
jobshield-app/
│
├── frontend/        → React client
├── backend/         → Express API
├── ml-model/        → Model training + inference
└── uploads/         → Resumes storage
```

---

## Installation

### 1. Clone repository

```
git clone https://github.com/Prakruthi19/jobshield-app.git
cd jobshield-app
```

### 2. Backend Setup

```
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Create `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/jobshield
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## Authentication Flow

1. User logs in via Email/Password or Google
2. Backend verifies credentials
3. JWT stored in sessionStorage
4. Protected routes require token
5. Employers access recruiter dashboard
6. Seekers access application dashboard

---

## Important API Endpoints

### Jobs

```
GET    /api/jobs
POST   /api/jobs
PATCH  /api/jobs/:id
DELETE /api/jobs/:id
```

### Applications

```
POST /api/applications/:jobId
GET  /api/applications/me
GET  /api/applications/employer
```

### Users

```
GET   /api/users/profile
PATCH /api/users/profile
```

---

## How Fraud Detection Works

When a job is created:

Job Created → Text processed → ML Model → Fraud Probability → Trust Score saved

Jobs with high risk can be flagged or hidden.

---

## Future Improvements

* Firebase resume storage
* Employer analytics dashboard
* Shortlist / reject candidates
* Email notifications
* Real-time alerts for suspicious postings
* Browser extension job scam detector

---

## Security

* JWT authentication
* Google OAuth verification
* Protected employer routes
* Ownership verification on job updates
* Resume access limited to job owner

---

## Author

Prakruthi Koteshwar
Full Stack + ML Developer

---

## Purpose

Online job scams are increasing rapidly.
JobShield aims to make job searching safer and trustworthy using AI-assisted verification.

---

If you like the project — consider starring the repository.
