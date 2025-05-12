import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);

  // Fetch all courses
  useEffect(() => {
    axios.get('http://localhost:8080/courses')
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  // Fetch single course details
  useEffect(() => {
    if (selectedCourseId !== null) {
      axios.get(`http://localhost:8080/courses/${selectedCourseId}`)
        .then((res) => setCourseDetails(res.data))
        .catch(console.error);
    }
  }, [selectedCourseId]);

  // Book Now Handler
  const handleBookNow = () => {
    alert(`Course Booked: ${courseDetails.courseName}`);
  };

  // === SHOW DETAILS PAGE ===
  if (courseDetails) {
    return (
      <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded">
        <img
          src={`data:image/jpeg;base64,${courseDetails.imageBase64}`}
          alt={courseDetails.courseName}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{courseDetails.courseName}</h1>
        <p className="mb-4 text-gray-700">{courseDetails.description}</p>
        <p><strong>Fees:</strong> ₹{courseDetails.fees}</p>
        <p><strong>Duration:</strong> {courseDetails.duration}</p>
        <p><strong>Teacher:</strong> {courseDetails.teacherName}</p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleBookNow}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Book Now
          </button>
          <button
            onClick={() => {
              setSelectedCourseId(null);
              setCourseDetails(null);
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  //  SHOW LIST PAGE 
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {courses.map((course) => (
        <div key={course.courseId} className="bg-white p-4 shadow rounded">
          <img
            src={`data:image/jpeg;base64,${course.imageBase64}`}
            alt={course.courseName}
            className="w-full h-40 object-cover mb-2 rounded"
          />
          <h2 className="text-xl font-semibold">{course.courseName}</h2>
          <p className="text-gray-600 text-sm mb-2">
            {course.description.slice(0, 80)}...
          </p>
          <button
            onClick={() => setSelectedCourseId(course.courseId)}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default ShowCourses;
