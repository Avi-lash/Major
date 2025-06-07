import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Suppose you get user info from props or context.
// For now, let's hardcode dummy user info or you can pass it as a prop to this component.
const dummyUser = {
  id: 101,
  name: 'John Doe',
  email: 'john@example.com',
};

const PayMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course;

  if (!course) {
    // Redirect back if no course info
    navigate('/');
    return null;
  }

  // Combine course + user info
  const paymentData = { course, user: dummyUser };

  const handleCardPayment = () => {
    navigate('/pay1', { state: paymentData });
  };

  const handleUpiPayment = () => {
    navigate('/pay2', { state: paymentData });
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded text-black">
      <h1 className="text-2xl font-bold mb-4">Payment for: {course.courseName}</h1>
      <p><strong>Course ID:</strong> {course.courseId}</p>
      <p><strong>Price:</strong> ₹{course.fees}</p>
      <p><strong>Teacher:</strong> {course.teacherName}</p>
      <p className="mb-6"><strong>Details:</strong> {course.description}</p>

      <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>

      <div className="flex gap-4">
        <button
          onClick={handleCardPayment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
        >
          Pay with Card
        </button>

        <button
          onClick={handleUpiPayment}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
        >
          Pay with UPI
        </button>
      </div>
    </div>
  );
};

export default PayMethod;
