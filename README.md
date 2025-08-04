# 🛠️ BlueSkills Documentation

BlueSkills is a full-stack digital platform designed to bridge the gap between **blue-collar job seekers** and **employers**. The system supports role-based access, real-time applications, and profile management in a mobile-first, modern web app experience.

---

## 1. 📖 Overview

### 🔹 Short Description

**BlueSkills** is a job connection platform for blue-collar workers and employers, offering tools for job discovery, application management, and candidate outreach. The platform is optimized for low-bandwidth environments and simple UX.

---

### 🔹 Key Features

- Role-based authentication: Job Seeker vs Employer
- Profile creation with skill tagging & resume upload
- Job listing and filtering (by skill, location, type)
- Application tracking & management
- Real-time interview invitations
- Mobile-first responsive design

---

### 🔹 Tech Stack

| Layer       | Technology             |
|------------|------------------------|
| Frontend    | Next.js (React)        |
| Styling     | Tailwind CSS           |
| Backend     | Node.js + Express.js   |
| Database    | MySQL (via Prisma ORM) |
| Auth        | Firebase Authentication|
| File Upload | Firebase Storage       |
| Hosting     | Vercel / Render        |

---

### 🔹 Target Audience

- **Job Seekers**: Workers in trade/labor roles (plumbers, drivers, mechanics, welders, etc.)
- **Employers**: Individuals, businesses, or recruiters offering jobs in blue-collar sectors

---

## 2. 🔄 Basic User Workflow

### 👷 Job Seeker Flow

1. **Register / Login** via Firebase (select *Job Seeker* role)
2. **Create Profile** with skills, location, and resume (optional)
3. **Browse Jobs** and apply with one click
4. **Track Applications** via dashboard
5. **Receive Messages** or job offers from employers

---

### 🧑‍💼 Employer Flow

1. **Register / Login** via Firebase (select *Employer* role)
2. **Create Company Profile**
3. **Post Job Listings** with job title, type, location, and requirements
4. **View Applicants** and filter by skills or resume
5. **Invite for Interviews** or send job offers

---

## 3. 🧩 Modules

### 3.1 Authentication Module

- Firebase Auth for login/register
- Role-based access middleware in Express
- Email/Password login only (social login optional)

### 3.2 User Profile Module

- Separated JobSeeker and Employer models
- Resume/CV upload (PDF via Firebase Storage)
- Skill tagging (stored as array of strings)

### 3.3 Job Posting Module

- Employers create/update/delete job listings
- Jobs stored with employer ID and metadata
- Publicly viewable by job seekers

### 3.4 Application Module

- Job seekers apply to job listings
- Each application tracked with status
- Employers can update status (e.g. pending, shortlisted, hired)

### 3.5 Notification/Message Module (Planned)

- Employer can send interview invitations
- Email or in-app notifications (future upgrade)

---

## 4. 📄 Pages

### 🔐 Auth Pages
| Path             | Description                    |
|------------------|--------------------------------|
| `/login`         | Firebase Auth Login            |
| `/register`      | Choose role + Firebase Register|

---

### 👷 Job Seeker Pages
| Path                          | Description                            |
|-------------------------------|----------------------------------------|
| `/dashboard/jobseeker`        | Overview of profile, applications      |
| `/jobseekers/profile/edit`    | Update bio, skills, resume             |
| `/jobs`                       | List and search all available jobs     |
| `/jobs/:id`                   | View detailed job info and apply       |
| `/applications`              | View all applications made             |

---

### 🧑‍💼 Employer Pages
| Path                          | Description                            |
|-------------------------------|----------------------------------------|
| `/dashboard/employer`         | Manage company profile and jobs        |
| `/employer/jobs/create`       | Post a new job                         |
| `/employer/jobs`              | List all posted jobs                   |
| `/employer/jobs/:id/applicants`| View applicants per job               |

---

### 📄 Shared Pages
| Path                          | Description                            |
|-------------------------------|----------------------------------------|
| `/`                           | Home / Landing Page                    |
| `/about`                      | About the platform                     |
| `/contact`                    | Contact form or support email          |

---

**✅ Need more?**  
I can also generate:
- API endpoint tables
- Database schema visualizations
- Component structure for the frontend
- Swagger/OpenAPI docs

Let me know if you'd like any of these next.
