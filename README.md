# EduNexus: Next-Gen LMS Platform
A modern, full-featured Learning Management System (LMS) for institutions and online classrooms. EduNexus empowers instructors and students with seamless course management, assignments, video lectures, real-time chat, and beautiful, responsive UI/UX.

# 🌐 Live Demo
Frontend (Vercel): your-frontend-url.vercel.app

Backend (Render): edunexus-x4no.onrender.com

# 🎯 Project Highlights
Multi-role authentication: Users register and login as students or instructors.

Custom dash: Each user lands on a personalized dashboard with at-a-glance stats and colorful navigation cards.

Vibrant Interface: Figma-inspired, responsive dashboard with dark/light mode toggle.

Role-based navigation: Sidebar menu adapts for student/instructor, linking to exactly the right tools.

End-to-end assignments: Instructors post assignments, students upload solutions—everything tracked.

Video lectures: Instructors upload video resources; students watch them in-page by course.

Live chat & announcements: (if enabled) for direct messaging and group updates.

Extensible: Clean code for adding new features like attendance, analytics, or grading.

# 🗺️ Site Flow
1. Landing & Registration
Users see a home page with options to log in or sign up.

During signup, users select role (Student/Instructor).

2. Authentication
Uses JWT. On login/signup, the user is redirected to a role-based dashboard.

Auth state is persisted, so users stay logged in across sessions.

3. Dashboard
Colorful cards (Courses, Assignments, Announcements, Messages).

Sidebar with key navigation: Dashboard / Courses / Assignments / Chat / Profile.

Cards link to details (e.g., "My Assignments" → Assignment Page).

4. Courses
Instructors: Create, update, delete, and list courses they've created.

Students: Browse all courses, enroll in new ones, see enrolled list.

5. Assignments
Instructor: Create assignment (with title, description, due date), view student submissions.

Student: View assignments per enrolled course, submit solutions (text/file).

6. Video Lectures
Instructor: Upload video lectures to a course.

Student: Watch lectures from the "My Courses" or video page for each course.

7. Chat & Announcements
Instructor and student can participate in real-time chat or read course/group announcements (if enabled).

# 🏗️ Tech Stack
Frontend: React (Vite), Tailwind CSS, Material Icons/FontAwesome

Backend: Node.js, Express.js, MongoDB/Mongoose

Auth: JWT

Video: Cloudinary

Deployment: Vercel (frontend), Render (backend)

Storage: Environment variables managed with .env (never committed)

# 📸 Site Previews

<img width="1919" height="877" alt="Screenshot 2025-11-01 120420" src="https://github.com/user-attachments/assets/0f9b42cb-e56c-4686-b9fe-403bcd110ede" />

<img width="1919" height="876" alt="Screenshot 2025-11-01 120430" src="https://github.com/user-attachments/assets/da90b677-b446-433c-9762-0e65971fda7c" />

<img width="1919" height="872" alt="Screenshot 2025-11-01 120442" src="https://github.com/user-attachments/assets/4cfa43f7-2729-4d7c-be8a-71a9d13d76e8" />

<img width="1919" height="873" alt="Screenshot 2025-11-01 120505" src="https://github.com/user-attachments/assets/41573a32-f424-4fed-8575-ec303d3896f2" />

<img width="1919" height="878" alt="Screenshot 2025-11-01 120518" src="https://github.com/user-attachments/assets/19f4fbbc-7fa0-46cd-b96c-441b9a91d9a1" />

<img width="1919" height="878" alt="Screenshot 2025-11-01 120540" src="https://github.com/user-attachments/assets/2463ec35-3c35-44a2-b9c6-2f584137aeca" />

<img width="1919" height="879" alt="Screenshot 2025-11-01 120556" src="https://github.com/user-attachments/assets/7210bdfb-7cb2-45bf-a045-70231d39d4aa" />

<img width="1919" height="882" alt="Screenshot 2025-11-01 120630" src="https://github.com/user-attachments/assets/2bdb1cc5-b654-4304-879b-eed01c75009d" />

<img width="1919" height="876" alt="Screenshot 2025-11-01 120649" src="https://github.com/user-attachments/assets/e6af60e3-896a-463c-9297-33d53003e5b3" />

# 🛠️ Getting Started (Local Development)
1. Clone this repository:

bash
git clone https://github.com/kumaradityaapril/EDUNEXUS.git
cd EDUNEXUS
2. Setup Backend:

bash
cd server
npm install
# Create a .env file as per .env.example with your keys
npm start
3. Setup Frontend:

bash
cd ../client
npm install
# Create a .env file as per .env.example
npm run dev

# 🔐 Environment Variables
See client/.env.example and server/.env.example for necessary variables (API URLs, secrets, Cloudinary, MongoDB, etc.).
