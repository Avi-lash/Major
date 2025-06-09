// src/admin/components/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import { courseApi, teacherApi } from './api'; // Import course and teacher API functions
import toast from 'react-hot-toast'; // For notifications

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]); // To populate the teacher dropdown
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    fees: '',
    duration: '',
    teacherName: '', // This will hold the selected teacher's name
  });
  const [selectedImage, setSelectedImage] = useState(null); // For image upload
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchTeachersForDropdown(); // Fetch teachers when component mounts
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await courseApi.getAllCourses();
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses. Please check your backend endpoint /api/v1/courses.');
      toast.error('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachersForDropdown = async () => {
    try {
      // NOTE: Again, you MUST implement GET /teacher/all endpoint on your backend
      const response = await teacherApi.getAllTeachers();
      setTeachers(response.data);
    } catch (err) {
      console.error('Error fetching teachers for dropdown:', err);
      toast.error('Failed to load teachers for dropdown.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleAddEditSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData(); // Use FormData for multipart/form-data
    dataToSend.append('courseName', formData.courseName);
    dataToSend.append('description', formData.description);
    dataToSend.append('fees', formData.fees);
    dataToSend.append('duration', formData.duration);
    dataToSend.append('teacherName', formData.teacherName);
    if (selectedImage) {
      dataToSend.append('image', selectedImage);
    } else if (editingCourse && editingCourse.imageBase64 && !selectedImage) {
        // If editing and no new image selected, but existing image exists,
        // you might need to send a flag or the base64 string depending on your backend update endpoint.
        // For simplicity, we'll assume if no new image, backend keeps old one.
        // If your backend requires the image data on PUT even if not changed, you'll need to re-encode.
    }


    try {
      if (editingCourse) {
        // Assuming your PUT endpoint expects FormData as well, adjust if it expects JSON
        await courseApi.updateCourse(editingCourse.courseId, dataToSend);
        toast.success('Course updated successfully!');
      } else {
        await courseApi.createCourse(dataToSend);
        toast.success('Course added successfully!');
      }
      setShowModal(false);
      setFormData({ courseName: '', description: '', fees: '', duration: '', teacherName: '' }); // Reset form
      setSelectedImage(null); // Reset image
      setEditingCourse(null);
      fetchCourses(); // Refresh list
    } catch (err) {
      console.error('Error saving course:', err.response?.data || err.message);
      toast.error(`Failed to save course: ${err.response?.data || err.message}`);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setFormData({
      courseName: course.courseName || '',
      description: course.description || '',
      fees: course.fees || '',
      duration: course.duration || '',
      teacherName: course.teacherName || '',
    });
    setSelectedImage(null); // Clear selected image for edit, user can choose new one
    setShowModal(true);
  };

  const handleDeleteClick = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseApi.deleteCourse(courseId);
        toast.success('Course deleted successfully!');
        fetchCourses(); // Refresh list
      } catch (err) {
        console.error('Error deleting course:', err.response?.data || err.message);
        toast.error(`Failed to delete course: ${err.response?.data || err.message}`);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormData({ courseName: '', description: '', fees: '', duration: '', teacherName: '' }); // Reset form
    setSelectedImage(null); // Reset image
  };

  if (loading) return <div className="text-center p-6 text-lg">Loading courses...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Course Management</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-md mb-6 hover:from-green-600 hover:to-green-800 transition duration-300 shadow-lg"
      >
        Add New Course
      </button>

      {/* Course List Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Course Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Fees</th>
              <th className="py-3 px-6 text-left">Duration</th>
              <th className="py-3 px-6 text-left">Teacher</th>
              <th className="py-3 px-6 text-center">Image</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.courseId} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{course.courseId}</td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">{course.courseName || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{course.description || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">${course.fees ? course.fees.toFixed(2) : 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{course.duration || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{course.teacherName || 'N/A'}</td>
                  <td className="py-3 px-6 text-center">
                    {course.imageBase64 && (
                      <img
                        src={`data:image/jpeg;base64,${course.imageBase64}`}
                        alt={course.courseName}
                        className="w-16 h-16 object-cover rounded-full mx-auto"
                      />
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditClick(course)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(course.courseId)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-150"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 px-6 text-center text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform scale-95 transition-transform duration-300 ease-out">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            <form onSubmit={handleAddEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="courseName" className="block text-gray-700 text-sm font-semibold mb-2">
                    Course Name:
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fees" className="block text-gray-700 text-sm font-semibold mb-2">
                    Fees:
                  </label>
                  <input
                    type="number"
                    id="fees"
                    name="fees"
                    value={formData.fees}
                    onChange={handleInputChange}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150"
                    required
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="duration" className="block text-gray-700 text-sm font-semibold mb-2">
                    Duration:
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150"
                    placeholder="e.g., 6 weeks, 3 months"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="teacherName" className="block text-gray-700 text-sm font-semibold mb-2">
                    Teacher:
                  </label>
                  <select
                    id="teacherName"
                    name="teacherName"
                    value={formData.teacherName}
                    onChange={handleInputChange}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 bg-white"
                    required
                  >
                    <option value="">Select a Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.name}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="image" className="block text-gray-700 text-sm font-semibold mb-2">
                    Course Image:
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                    // Required only for add, not necessarily for edit if image is optional
                    required={!editingCourse}
                  />
                  {editingCourse && editingCourse.imageBase64 && !selectedImage && (
                    <p className="text-xs text-gray-500 mt-2">Current image selected. Upload new one to change.</p>
                  )}
                  {selectedImage && (
                    <p className="text-xs text-gray-600 mt-2">New image selected: {selectedImage.name}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500 transition duration-150 shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-md hover:from-green-600 hover:to-green-800 transition duration-150 shadow"
                >
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;