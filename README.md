# TeachTeam Login System
A web-based login system for **TeachTeam** that enables new Lecturers and Candidate Applicants to sign up, log in, and apply for their chosen courses. The platform also allows lecturers to review applications and select candidates based on their qualifications.

## ✨ Features
- 📌 Role-based login (Lecturer & Candidate Applicant)
- 🔒 Email validation with error handling
- 💾 "Remember Me" feature using Local Storage
- 🎨 Modern UI with Material-UI (MUI)
- 🚀 Fast authentication flow


## 🛠 Tech Stack
- **Frontend**: React (TypeScript), Material-UI (MUI)
- **Backend**: NextJs (TypeScript)
- **Storage**: mySql

## 🚀 Getting Started
- To start the frontend, please ensure you are in the directory frontend/tt, then run npm run dev.
- Please sign in as a candidate or lecturer
- To sign in as a lecturer, select lecturer in the login tab, with the email test@example.com
- To sign in as a candidate, select candidate, then use any email from test3@example.com to test6@example.com
- Candidates can apply to courses in the courses tab.
- Lecturers can vew applicants who have applied to courses and accept them. Once an appilcant has been accepted comments and ranking can be left.

## Ensure that your own cofigs are provided, and setup database
- This needs to be done in the admin-backend/src folder as well as the backend/src folder
- The file should be config.ts file, with the following variable in it:
export const configForDataSource = {
    username: "",
    password: "",
    database: "",
}
- This needs to be done to ensure you will have access to the database.
- After the config has been provided, run npm run typeorm -- migration:run -d src/data-source.ts, while in /backend.
- This ensures dummy data is created.
- users with test@example.com and test1@example.com are lecturers
- users with test3@example.com and after are candidates.
- All defaul create users have the password as password123
