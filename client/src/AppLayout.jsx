import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';

export default function AppLayout({ title }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 flex">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header title={title} />
        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
