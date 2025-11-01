# EduNexus: Next-Gen LMS Platform
A modern, full-featured Learning Management System (LMS) for institutions and online classrooms. EduNexus empowers instructors and students with seamless course management, assignments, video lectures, real-time chat, and beautiful, responsive UI/UX.

🌐 Live Demo
Frontend (Vercel): your-frontend-url.vercel.app

Backend (Render): edunexus-x4no.onrender.com

🎯 Project Highlights
Multi-role authentication: Users register and login as students or instructors.

Custom dash: Each user lands on a personalized dashboard with at-a-glance stats and colorful navigation cards.

Vibrant Interface: Figma-inspired, responsive dashboard with dark/light mode toggle.

Role-based navigation: Sidebar menu adapts for student/instructor, linking to exactly the right tools.

End-to-end assignments: Instructors post assignments, students upload solutions—everything tracked.

Video lectures: Instructors upload video resources; students watch them in-page by course.

Live chat & announcements: (if enabled) for direct messaging and group updates.

Extensible: Clean code for adding new features like attendance, analytics, or grading.

🗺️ Site Flow
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

🏗️ Tech Stack
Frontend: React (Vite), Tailwind CSS, Material Icons/FontAwesome

Backend: Node.js, Express.js, MongoDB/Mongoose

Auth: JWT

Video: Cloudinary

Deployment: Vercel (frontend), Render (backend)

Storage: Environment variables managed with .env (never committed)
