import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-10">
    <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <Link to="/" className="font-semibold text-lg">EduNexus</Link>
      <div className="flex items-center gap-4 text-sm">
        <Link className="hover:text-blue-600" to="/">Home</Link>
        <Link className="hover:text-blue-600" to="/login">Login</Link>
        <Link className="inline-flex items-center px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700" to="/signup">Signup</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
