
import axios from 'axios';

const API_CONFIG = {
  baseURL: 'http://localhost:8080', // Default Spring Boot port. Adjust if yours is different.
  headers: {
    'Content-Type': 'application/json',
     },
};

/**
 * Creates an Axios instance with base configurations.
 * This instance will be used for all API requests.
 */
const api = axios.create(API_CONFIG);

/**
 * Axios Interceptor for handling common API response errors.
 * Example: If a 401 Unauthorized response is received, you might want to redirect to login.
 */
api.interceptors.response.use(
  (response) => response, // If response is successful, just pass it through
  (error) => {
    // Check if the error has a response and status code
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
      // Example: Handle 401 Unauthorized globally
      if (error.response.status === 401) {
        console.warn('Authentication failed or token expired. Redirecting to login...');
        // Optional: Redirect to login page or clear user session/token
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., network error)
      console.error('API Error: No response received:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('API Error:', error.message);
    }
    return Promise.reject(error); // Propagate the error so components can handle it
  }
);

/**
 * API functions for Student entity.
 * Remember to implement the '/student/all' endpoint on your backend for full functionality.
 */
const studentApi = {
  // Fetches all students. (Backend: GET /student/all - you need to create this)
  getAllStudents: () => api.get('/student/all'),
  // Fetches a single student by ID. (Backend: GET /student/{id})
  getStudentById: (id) => api.get(`/student/${id}`),
  // Creates a new student. (Backend: POST /student/register)
  createStudent: (studentData) => api.post('/student/register', studentData),
  // Updates an existing student. (Backend: PUT /student/update/{id})
  updateStudent: (id, studentData) => api.put(`/student/update/${id}`, studentData),
  // Deletes a student by ID. (Backend: DELETE /student/{id})
  deleteStudent: (id) => api.delete(`/student/${id}`),
};

/**
 * API functions for Teacher entity.
 * Remember to implement the '/teacher/all' endpoint on your backend for full functionality.
 */
const teacherApi = {
  // Fetches all teachers. (Backend: GET /teacher/all - you need to create this)
  getAllTeachers: () => api.get('/teacher/all'),
  // Fetches a single teacher by ID. (Backend: GET /teacher/{id})
  getTeacherById: (id) => api.get(`/teacher/${id}`),
  // Creates a new teacher. (Backend: POST /teacher/register)
  createTeacher: (teacherData) => api.post('/teacher/register', teacherData),
  // Updates an existing teacher. (Backend: PUT /teacher/update/{id})
  updateTeacher: (id, teacherData) => api.put(`/teacher/update/${id}`, teacherData),
  // Deletes a teacher by ID. (Backend: DELETE /teacher/{id})
  deleteTeacher: (id) => api.delete(`/teacher/${id}`),
};

/**
 * API functions for Course entity.
 * Note: createCourse and updateCourse handle 'multipart/form-data' for image uploads.
 */
const courseApi = {
  // Fetches all courses. (Backend: GET /api/v1/courses)
  getAllCourses: () => api.get('/api/v1/courses'),
  // Fetches a single course by ID. (Backend: GET /api/v1/courses/{id})
  getCourseById: (id) => api.get(`/api/v1/courses/${id}`),
  // Creates a new course with potential image upload. (Backend: POST /api/v1/courses)
  createCourse: (formData) => api.post('/api/v1/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, // Essential for FormData
  }),
  // Updates an existing course with potential image upload. (Backend: PUT /api/v1/courses/update/{id})
  updateCourse: (id, formData) => api.put(`/api/v1/courses/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, // Essential if image is part of update
  }),
  // Deletes a course by ID. (Backend: DELETE /api/v1/courses/{id})
  deleteCourse: (id) => api.delete(`/api/v1/courses/${id}`),
};

// Export all API function groups for easy import in components
export {
  studentApi,
  teacherApi,
  courseApi
};