// File: Admin.jsx
import React from 'react';
import { FaUser, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link

const Admin = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-700 text-white flex flex-col items-center py-8">
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <nav className="space-y-6 text-lg font-medium">
          <button className="flex items-center gap-3 hover:text-purple-300 transition">
            <FaUser /> Profile
          </button>
          <button className="flex items-center gap-3 hover:text-purple-300 transition">
            <FaTachometerAlt /> Dashboard
          </button>
          <button className="flex items-center gap-3 hover:text-purple-300 transition">
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Manage Students */}
          <Link to="/studentadmin" className="block"> {/* Wrap with Link */}
            <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-xl p-6 shadow-md transform transition-transform duration-300 hover:scale-105 cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Manage</h2>
              <p className="text-3xl font-bold">STUDENTS</p>
            </div>
          </Link>

          {/* Manage Teachers */}
          <Link to="/teacheradmin" className="block"> {/* Wrap with Link */}
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl p-6 shadow-md transform transition-transform duration-300 hover:scale-105 cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Manage</h2>
              <p className="text-3xl font-bold">TEACHERS</p>
            </div>
          </Link>

          {/* Manage Courses */}
          <Link to="/courseadmin" className="block"> {/* Wrap with Link */}
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-6 shadow-md transform transition-transform duration-300 hover:scale-105 cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Manage</h2>
              <p className="text-3xl font-bold">Courses</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Admin;