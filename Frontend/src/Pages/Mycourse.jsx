import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Mycourse = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRandomHexColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  };

  useEffect(() => {
    if (!studentId) return;

    axios.get(`http://localhost:8080/payment/user/${studentId}`)
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch purchased courses.');
        setLoading(false);
        console.error("Error fetching purchased courses: ", err);
      });
  }, [studentId]);

  // New function to handle navigation to the Certificate page
  const handleViewCertificate = (courseId) => {
    // We can pass the studentId (from useParams) and the specific courseId
    // The Certificate component will then use these IDs to fetch the full names.
    navigate('/certificate', {
      state: {
        studentId: studentId,
        courseId: courseId
      }
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-800 text-lg">
        Loading purchased courses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-800 text-lg">
        No courses purchased yet.
      </div>
    );
  }


  return (
    <div className="popular-section min-h-screen">
      <div className="popular-header">
        <h2>My Purchased Courses</h2>
      </div>

      <div className="popular-courses">
        {courses.map((course) => (
          <div key={course.paymentId} className="course-card">
            <div className="card-header">
              Course ID: <span style={{ color: "#00ff9d" }}>{course.courseId}</span>
            </div>
            <div className="card-body">
              <h4>👨‍🏫 Teacher: {course.teacherName}</h4>
              <p className="learners">💰 Amount Paid: ₹{course.amount}</p>
              <p className="rating">
                📅 Purchase Date:{" "}
                {course.paymentDate ? new Date(course.paymentDate).toLocaleDateString() : "N/A"}
              </p>

              {/* Start Learning Button */}
              <button
                onClick={() => navigate(`/quiz/${course.courseId}`,  { state: { studentId: studentId } })} // Changed from /quiz to /learn
                className="offer-btn"
                style={{ backgroundColor: getRandomHexColor() }}
              >
                START LEARNING
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mycourse;