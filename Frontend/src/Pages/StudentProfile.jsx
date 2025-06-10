import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    axios.get(`http://localhost:8080/student/${studentId}`)
      .then(res => setStudent(res.data))
      .catch(err => console.error("Error fetching student:", err));
  }, [studentId]);

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  // Handler for the My Courses button
  const handleMyCourses = () => {
    navigate(`/mycourse/${studentId}`);
  };

  // Logout handler
  const handleLogout = () => {
    // Clear any auth tokens or user data stored
    localStorage.clear(); // or sessionStorage.clear()
    // Redirect to login or home page
    navigate('/login');  // change '/login' to your actual login route
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-500 mb-6">🎓 Student Profile</h2>
        <div className="space-y-4 text-gray-200">
          <p><span className="font-semibold">Name:</span> {student.name}</p>
          <p><span className="font-semibold">Email:</span> {student.email}</p>
          <p><span className="font-semibold">Phone:</span> {student.phnno}</p>
        </div>

        <button
          onClick={handleMyCourses}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
        >
          My Courses
        </button>

        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
