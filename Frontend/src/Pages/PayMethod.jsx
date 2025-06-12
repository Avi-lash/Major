import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    navigate('/');
    return null;
  }

  const paymentData = { course, user: dummyUser };

  const handleCardPayment = () => {
    navigate('/pay1', { state: paymentData });
  };

  const handleUpiPayment = () => {
    navigate('/pay2', { state: paymentData });
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="p-6 max-w-xl w-full mx-auto bg-gray-700 shadow rounded text-black mt-8">
        <h1 className="text-2xl font-bold mb-4">Payment for: {course.courseName}</h1>
        <p><strong>Course ID:</strong> {course.courseId}</p>
        <p><strong>Price:</strong> ₹{course.fees}</p>
        <p><strong>Teacher:</strong> {course.teacherName}</p>
        <p className="mb-6"><strong>Details:</strong> {course.description}</p>

        <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>

        <div className="flex gap-4">
          <button
            onClick={handleCardPayment}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-sky-600 text-white px-6 py-3 rounded"
          >
            Pay with Card
          </button>

          <button
            onClick={handleUpiPayment}
            className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-600 text-white px-6 py-3 rounded"
          >
            Pay with UPI
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayMethod;
