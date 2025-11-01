import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  return (
    <aside className="w-60 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hidden md:flex md:flex-col">
      <div className="h-14 flex items-center px-4 font-semibold">EduNexus</div>
      <nav className="px-2 py-3 space-y-1 text-sm">
        <NavLink className={({isActive}) => `block px-3 py-2 rounded-md ${isActive? 'bg-blue-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/dashboard">Dashboard</NavLink>
        {role === 'instructor' && (
          <>
            <NavLink className={({isActive}) => `block px-3 py-2 rounded-md ${isActive? 'bg-blue-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/instructor">Instructor</NavLink>
            <NavLink className={({isActive}) => `block px-3 py-2 rounded-md ${isActive? 'bg-blue-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/instructor-assignments">Assignments</NavLink>
            <NavLink className={({isActive}) => `block px-3 py-2 rounded-md ${isActive? 'bg-blue-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/submissions">Submissions</NavLink>
          </>
        )}
        {role === 'student' && (
          <>
            <NavLink className={({isActive}) => `block px-3 py-2 rounded-md ${isActive? 'bg-blue-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/student">Student</NavLink>
            <NavLink className={({isActive}) => `block px-3 py-2 rounded-md ${isActive? 'bg-blue-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/assignments">Assignments</NavLink>
          </>
        )}
        <NavLink className={({isActive}) => `block px-3 py-2 rounded-md ${isActive? 'bg-blue-600 text-white':'hover:bg-gray-100 dark:hover:bg-gray-800'}`} to="/chat">Chat</NavLink>
      </nav>
      <div className="mt-auto p-3 text-xs text-gray-500">{/* Footer or user panel */}</div>
    </aside>
  );
}
