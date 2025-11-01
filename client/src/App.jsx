import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import InstructorAssignments from './pages/InstructorAssignments';
import StudentAssignments from './pages/StudentAssignments';
import AllAssignments from './pages/AllAssignments';
import AppLayout from './AppLayout';
import DashboardCards from './components/DashboardCards';
import ProtectedRoute from './components/ProtectedRoute';
import RoleLanding from './components/RoleLanding';
import CourseLectures from './pages/CourseLectures';
import Chat from './pages/Chat';
import Submissions from './pages/Submissions';

// Navbar layout for public/auth pages
function NavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

// Main app
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with only the top Navbar */}
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Generic dashboard route redirects to role landing */}
        <Route element={<ProtectedRoute />}> 
          <Route element={<AppLayout title="Dashboard" />}> 
            <Route path="/dashboard" element={<RoleLanding />} />
          </Route>
          {/* Chat accessible to all authenticated users */}
          <Route element={<AppLayout title="Chat" />}> 
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Route>

        {/* Instructor-only routes */}
        <Route element={<ProtectedRoute role="instructor" />}> 
          <Route element={<AppLayout title="Instructor" />}> 
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor-assignments" element={<InstructorAssignments />} />
          </Route>
          <Route element={<AppLayout title="Submissions" />}> 
            <Route path="/submissions" element={<Submissions />} />
          </Route>
        </Route>

        {/* Student-only routes */}
        <Route element={<ProtectedRoute role="student" />}> 
          <Route element={<AppLayout title="Student" />}> 
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/assignments" element={<AllAssignments />} />
            <Route path="/student-assignments/:courseId" element={<StudentAssignments />} />
            <Route path="/courses/:courseId/lectures" element={<CourseLectures />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
