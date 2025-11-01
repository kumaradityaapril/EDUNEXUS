import React from 'react';

export default function DashboardCards() {
  // Sample blocks
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 text-blue-900 p-5">My Courses</div>
      <div className="rounded-xl border border-orange-200 bg-orange-50 text-orange-900 p-5">Assignments Due</div>
      <div className="rounded-xl border border-purple-200 bg-purple-50 text-purple-900 p-5">Messages</div>
    </div>
  );
}
