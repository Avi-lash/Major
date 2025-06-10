import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Pay2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};

  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    if (storedStudent) {
      const parsed = JSON.parse(storedStudent);
      setUserId(parsed.studentId);
    } else {
      alert('User not logged in!');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!course) {
      navigate('/');
    }
  }, [course, navigate]);

  if (!course) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    const paymentData = {
      courseId: Number(course.courseId),
      userId: Number(userId),
      teacherName: course.teacherName || '',
      amount: Number(course.fees),
      payerName: name.trim(),
      payerEmail: email.trim(),
      paymentMethod: 'PayPal',
    };

    try {
      await axios.post('http://localhost:8080/payment/confirm', paymentData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      alert(`Payment successful for ${course.courseName} via PayPal!`);
      // Redirect to /mycourse/:studentId
      navigate(`/mycourse/${userId}`);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-md text-white">
        <img
          src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
          alt="PayPal"
          className="w-32 mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold text-center mb-4">Pay with PayPal</h2>

        <p className="text-center mb-6 text-lg">
          <strong>Amount:</strong> ₹{course.fees}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              className="w-full border px-4 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Pay2;
