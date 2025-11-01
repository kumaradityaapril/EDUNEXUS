import React, { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';

export default function Header({ title }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const userRole = localStorage.getItem('role');
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser({ name: 'User', email: '' });
      }
    }
    setRole(userRole);
  }, []);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getRoleColor = (role) => {
    if (role === 'instructor') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (role === 'student') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {getUserInitials(user.name)}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-gray-900 leading-tight">{user.name || 'User'}</span>
              {role && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getRoleColor(role)} font-medium capitalize leading-tight mt-0.5`}>
                  {role}
                </span>
              )}
            </div>
          </div>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
