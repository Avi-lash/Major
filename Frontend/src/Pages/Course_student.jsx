import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CourseStudent = () => {
  const location = useLocation();
  const { courseId } = location.state || {};

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!courseId) {
      setError('No course ID provided.');
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8080/payment/course/${courseId}`, { withCredentials: true })
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch student details.');
        console.error(err);
        setLoading(false);
      });
  }, [courseId]);

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.header}>👩‍🎓 Enrolled Students</h1>

      {loading ? (
        <p style={styles.message}>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : students.length === 0 ? (
        <p style={styles.message}>No students enrolled in this course.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Enrollment Date</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.studentId}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{student.name}</td>
                <td style={styles.td}>{student.email}</td>
                <td style={styles.td}>{student.enrolledDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '40px',
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '32px',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#0ff',
    textShadow: '0 0 10px #0ff',
  },
  message: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#ccc',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '18px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#111',
    boxShadow: '0 0 10px rgba(0,255,255,0.2)',
  },
  th: {
    borderBottom: '2px solid #0ff',
    padding: '12px',
    color: '#0ff',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #333',
    color: '#eee',
  },
};

export default CourseStudent;
