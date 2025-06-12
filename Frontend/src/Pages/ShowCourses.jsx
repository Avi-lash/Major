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
   <div className="min-h-screen bg-gray-800 p-10">
  <h1 className="text-4xl font-bold text-center text-gray-200 mb-10">🎓 Available Courses</h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    {courses.map((course) => {
      const gradients = [
        'from-orange-400 to-yellow-300',
        'from-purple-500 to-indigo-400',
        'from-pink-500 to-rose-400',
        'from-teal-400 to-cyan-300',
        'from-blue-500 to-sky-400',
      ];
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

      return (
        <div
          key={course.courseId}
          className="bg-purple-950 rounded-2xl shadow-md overflow-hidden transition-transform transform hover:scale-[1.02]"
        >
          <div className={`relative bg-gradient-to-tr ${randomGradient} h-44`}>
            <img
              src={`data:image/jpeg;base64,${course.imageBase64}`}
              alt={course.courseName}
              className="absolute inset-0 w-full h-full object-cover opacity-80 rounded-t-2xl"
            />
          </div>

          <div className="p-5">
            <h2 className="text-xl font-bold text-gray-200">{course.courseName}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {course.description.slice(0, 80)}...
            </p>

            <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-900">
              <span className="bg-gray-100 rounded-full px-3 py-1">👨‍🏫 {course.teacherName}</span>
              <span className="bg-gray-100 rounded-full px-3 py-1">⏳ {course.duration}</span>
              <span className="bg-gray-100 rounded-full px-3 py-1">💰 ₹{course.fees}</span>
            </div>

            <button
              onClick={() => setSelectedCourseId(course.courseId)}
              className="mt-5 w-full bg-sky-600 hover:bg-sky-500 text-black font-semibold py-2 rounded-lg transition-all"
            >
              🔍 View Details
            </button>
          </div>
        </div>
      );
    })}
  </div>
</div>
  );
};

export default ShowCourses;