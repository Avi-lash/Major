import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'teacher' // Default role
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save selected role in localStorage for future use (e.g., forgot password)
      localStorage.setItem('userRole', form.role);

      const endpoint =
        form.role === 'teacher'
          ? 'http://localhost:8080/teacher/login'
          : 'http://localhost:8080/student/login';

      const response = await axios.post(
        endpoint,
        {
          email: form.email,
          password: form.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      toast.success(response.data);
      navigate('/home'); 
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = () => {
    localStorage.setItem('userRole', form.role);
    navigate('/forgot-password');
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex items-center justify-center">
      <ToastContainer />
      <div className="bg-[#0f172a] p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Welcome Back</h2>
        <p className="text-sm text-center mb-6 text-gray-400">
          New here?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Role selection */}
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={form.role === 'teacher'}
                onChange={handleChange}
                className="accent-blue-500"
              />
              Teacher
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="student"
                checked={form.role === 'student'}
                onChange={handleChange}
                className="accent-blue-500"
              />
              Student
            </label>
          </div>

          <input
            type="email"
            name="email"
            autoComplete="off"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            autoComplete="off"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold"
          >
            Log in
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-6 text-sm text-center text-gray-400 space-x-4">
          <button onClick={handleForgotPassword} className="hover:underline text-blue-400">
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
