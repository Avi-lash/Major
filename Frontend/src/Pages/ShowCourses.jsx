import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShowCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch all courses
  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/courses')
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  // ✅ Fetch single course details
  useEffect(() => {
    if (selectedCourseId !== null) {
      axios.get(`http://localhost:8080/api/v1/courses/${selectedCourseId}`)
        .then((res) => setCourseDetails(res.data))
        .catch(console.error);
    }
  }, [selectedCourseId]);

  // Book Now Handler - redirect to PayMethod page with course details
  const handleBookNow = () => {
    navigate('/paymethod', { state: { course: courseDetails } });
  };

  // Show course details page
  if (courseDetails) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
  <div className="p-6 max-w-2xl mx-auto bg-purple-900 shadow-xl rounded-lg text-white mt-8">
    <img
      src={`data:image/jpeg;base64,${courseDetails.imageBase64}`}
      alt={courseDetails.courseName}
      className="w-full h-64 object-cover rounded-lg mb-4"
    />
    <h1 className="text-4xl font-bold mb-2">{courseDetails.courseName}</h1>
    <p className="mb-4">{courseDetails.description}</p>
    <p className="font-semibold mb-4">💰 Fees: ₹{courseDetails.fees}</p>
    <p className="font-semibold mb-4">⏳ Duration: {courseDetails.duration}</p>
    <p className="font-semibold mb-4">👨‍🏫 Teacher: {courseDetails.teacherName}</p>
    <div className="mt-6 flex gap-4">
      <button
        onClick={handleBookNow}
        className="bg-green-600 hover:bg-green-600 shadow-lg hover:shadow-green-400 text-white px-5 py-3 rounded-lg transition-transform transform hover:scale-105"
      >
        📖 Book Now
      </button>
      <button
        onClick={() => {
          setSelectedCourseId(null);
          setCourseDetails(null);
        }}
        className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg transition-transform transform hover:scale-105"
      >
        🔙 Back
      </button>
    </div>
  </div>
</div>
    );
  }

  // Show courses list page
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-200 mb-8">🎓 Available Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.courseId} className="bg-gray-700 p-6 shadow-xl hover:shadow-gray-400 rounded-lg transition-transform transform hover:scale-105">
            <img
              src={`data:image/jpeg;base64,${course.imageBase64}`}
              alt={course.courseName}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-200">{course.courseName}</h2>
            <p className="text-gray-200 text-sm mb-2">{course.description.slice(0, 80)}...</p>
            <button
              onClick={() => setSelectedCourseId(course.courseId)}
              className="mt-2 bg-emerald-600 hover:bg-green-400 text-white px-4 py-2 rounded-lg w-full transition-colors duration-300"
            >
              🔍 View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowCourses;