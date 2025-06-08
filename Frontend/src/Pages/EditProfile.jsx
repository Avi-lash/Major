import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const [teacher, setTeacher] = useState({
    name: '',
    email: '',
    phnno: ''
  });

  const [message, setMessage] = useState('');
  const teacherData = JSON.parse(localStorage.getItem('teacher'));
  const teacherId = teacherData?.teacherId;

  useEffect(() => {
    if (!teacherId) return;

    axios.get(`http://localhost:8080/teacher/${teacherId}`, {
      withCredentials: true
    })
      .then((res) => {
        setTeacher(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch teacher info', err);
      });
  }, [teacherId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/teacher/${teacherId}`, teacher, {
      withCredentials: true
    })
      .then((res) => {
        setMessage('Profile updated successfully!');
      })
      .catch((err) => {
        console.error('Failed to update profile', err);
        setMessage('Update failed.');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">Edit Profile</h2>
        {message && <p className="mb-4 text-sm text-green-400 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={teacher.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={teacher.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              name="phnno"
              value={teacher.phnno}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded font-semibold transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
