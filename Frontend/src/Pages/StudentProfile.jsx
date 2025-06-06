import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StudentProfile = () => {
  const { studentId } = useParams();
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">🎓 Student Profile</h2>
        <div className="space-y-4 text-gray-700">
          <p><span className="font-semibold">Name:</span> {student.name}</p>
          <p><span className="font-semibold">Email:</span> {student.email}</p>
          <p><span className="font-semibold">Phone:</span> {student.phnno}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
