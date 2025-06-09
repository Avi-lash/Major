import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignupForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'teacher' // Default role
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      toast.error('Password must be at least 8 characters with 1 number and 1 special character.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Password and Confirm Password must match.');
      return;
    }

    if (!validatePhone(form.phone)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        form.role === 'teacher'
          ? 'http://localhost:8080/teacher/register'
          : 'http://localhost:8080/student/register';

      await axios.post(
        endpoint,
        {
          name: form.name,
          email: form.email,
          phnno: form.phone,
          password: form.password
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      toast.success('Signup successful!');
      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'teacher'
      });
      
        navigate('/login');
      
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.includes('Email already registered')) {
        toast.error('Email already registered.');
      } else {
        toast.error('Failed to sign up. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <ToastContainer />
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-400">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role selection using radio buttons */}
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={form.role === 'teacher'}
                onChange={handleChange}
                className="accent-indigo-500"
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
                className="accent-indigo-500"
              />
              Student
            </label>
          </div>

          <div>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg ${
                loading ? 'bg-gray-600' : 'bg-indigo-500'
              } text-white font-semibold hover:bg-indigo-600 transition duration-300`}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4 text-gray-400">
        <Link to="/" className="text-indigo-400 hover:underline">
  Login
</Link>
        </div>
      </div>
    </div>
  );
}
