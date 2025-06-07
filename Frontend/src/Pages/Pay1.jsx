import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Pay1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};

  const [userId, setUserId] = useState(null);

  const [cardInfo, setCardInfo] = useState({
    name: '',
    number: '',
    expiry: null,
    cvv: '',
  });

  const [errors, setErrors] = useState({});
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow only digits for card number and cvv
    if ((name === 'number' || name === 'cvv') && /\D/.test(value)) return;

    setCardInfo({ ...cardInfo, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const cardNumberRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;

    if (!cardInfo.name.trim()) newErrors.name = 'Cardholder name is required.';
    if (!cardNumberRegex.test(cardInfo.number)) newErrors.number = 'Card number must be 16 digits.';

    const now = new Date();
    const expiry = cardInfo.expiry;
    if (!expiry) {
      newErrors.expiry = 'Expiry date is required.';
    } else {
      const expYear = expiry.getFullYear();
      const expMonth = expiry.getMonth();
      const nowYear = now.getFullYear();
      const nowMonth = now.getMonth();

      if (expYear < nowYear || (expYear === nowYear && expMonth < nowMonth)) {
        newErrors.expiry = 'Expiry date must be current or future month.';
      }
    }

    if (!cvvRegex.test(cardInfo.cvv)) newErrors.cvv = 'CVV must be 3 digits.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatExpiry = (date) => {
    if (!date) return null;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month.toString().padStart(2, '0')}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const purchaseData = {
      courseId: Number(course.courseId),
      userId: Number(userId),
      teacherName: course.teacherName || '',
      amount: Number(course.fees),
      expiry: formatExpiry(cardInfo.expiry),
      cardHolderName: cardInfo.name.trim(),
      cardNumber: cardInfo.number,
      cvv: cardInfo.cvv,
      paymentMethod: 'Card',
    };

    try {
      await axios.post('http://localhost:8080/payment/confirm', purchaseData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      alert('Payment successful!');
      // Redirect to /mycourse/:studentId
      navigate(`/mycourse/${userId}`);
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded text-black">
      <h2 className="text-2xl font-bold mb-4">Pay with Card</h2>
      <p className="mb-4 text-lg">
        <strong>Amount:</strong> ₹{course.fees}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Cardholder Name</label>
          <input
            type="text"
            name="name"
            value={cardInfo.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            disabled={loading}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block mb-1">Card Number</label>
          <input
            type="text"
            name="number"
            maxLength={16}
            value={cardInfo.number}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            disabled={loading}
          />
          {errors.number && <p className="text-red-600 text-sm">{errors.number}</p>}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1">Expiry Date</label>
            <DatePicker
              selected={cardInfo.expiry}
              onChange={(date) => {
                setCardInfo({ ...cardInfo, expiry: date });
                if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: null }));
              }}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="w-full border border-gray-300 px-3 py-2 rounded"
              placeholderText="MM/YYYY"
              minDate={new Date()}
              disabled={loading}
            />
            {errors.expiry && <p className="text-red-600 text-sm">{errors.expiry}</p>}
          </div>

          <div className="flex-1">
            <label className="block mb-1">CVV</label>
            <input
              type="password"
              name="cvv"
              maxLength={3}
              value={cardInfo.cvv}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              disabled={loading}
            />
            {errors.cvv && <p className="text-red-600 text-sm">{errors.cvv}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm Payment'}
        </button>
      </form>
    </div>
  );
};

export default Pay1;
