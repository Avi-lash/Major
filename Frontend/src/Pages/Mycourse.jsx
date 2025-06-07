import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Mycourse = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div className="text-center mt-10">Loading purchased courses...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  if (courses.length === 0) {
    return <div className="text-center mt-10">No courses purchased yet.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Purchased Courses</h2>
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course.paymentId} className="border p-4 rounded shadow">
            <p><strong>Course ID:</strong> {course.courseId}</p>
            <p><strong>Teacher:</strong> {course.teacherName}</p>
            <p><strong>Amount Paid:</strong> ₹{course.amount}</p>
            <p>
              <strong>Purchase Date:</strong>{' '}
              {course.paymentDate ? new Date(course.paymentDate).toLocaleDateString() : 'N/A'}
            </p>
            <button
              onClick={() => navigate('/quiz')}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              START LEARNING
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Mycourse;
