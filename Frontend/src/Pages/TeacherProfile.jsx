import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState({
    name: '',
    email: '',
    phnno: ''
  });

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

  const handleLogout = () => {
    axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem('teacher');
        window.location.href = '/'; // or use navigate('/login') if you're using react-router
      })
      .catch((err) => {
        console.error('Logout failed', err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-40 h-40 rounded-full border-4 border-cyan-400 overflow-hidden bg-gray-700 flex items-center justify-center text-5xl">
            👩‍🏫
          </div>
        </div>
        <h2 className="text-2xl font-bold !text-white mb-2">{teacher.name}</h2>
        <p className="text-base mb-1"><strong>📞 Phone:</strong> {teacher.phnno}</p>
        <p className="text-base"><strong>✉️ Email:</strong> {teacher.email}</p>

        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default TeacherProfile;
