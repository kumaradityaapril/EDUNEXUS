import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-12 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Learn smarter. Teach faster. Together.
          </h1>
          <p className="text-gray-800 text-lg max-w-xl font-medium">
            Manage courses, publish assignments, and deliver engaging learning experiences — all in one simple, modern platform.
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <Link to="/signup" className="inline-flex items-center px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700">Get Started</Link>
            <Link to="/login" className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">Sign in</Link>
          </div>
          
        </div>
        <div>
          <img className="w-full rounded-xl shadow-lg" src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop" alt="Learning management system dashboard" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="text-2xl">📚</div>
            <h3 className="font-semibold mt-2">Course Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Create and organize courses with modules, videos, and resources.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="text-2xl">📝</div>
            <h3 className="font-semibold mt-2">Assignments & Submissions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Publish assignments, collect answers, and track student progress.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="text-2xl">🌙</div>
            <h3 className="font-semibold mt-2">Beautiful UI + Dark Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Clean, distraction-free design that looks great day or night.</p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <img className="rounded-lg h-28 w-full object-cover" src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop" alt="Students learning online" />
          <img className="rounded-lg h-28 w-full object-cover" src="https://images.unsplash.com/photo-1498079022511-d15614cb1c02?q=80&w=1200&auto=format&fit=crop" alt="Instructor creating course" />
          <img className="rounded-lg h-28 w-full object-cover" src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop" alt="Assignments and collaboration" />
          <img className="rounded-lg h-28 w-full object-cover" src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop" alt="Video lecture" />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="rounded-2xl p-8 md:p-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">Ready to build your next course?</h3>
          <p className="opacity-90 mt-2">Join educators and students using EduNexus today.</p>
          <div className="pt-4">
            <Link to="/signup" className="inline-flex items-center px-3 py-1 rounded-md bg-white text-blue-700 hover:bg-blue-50">Create free account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Home;
