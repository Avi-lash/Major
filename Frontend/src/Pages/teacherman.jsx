// src/admin/components/TeacherManagement.jsx
import React, { useState, useEffect } from 'react';
import { teacherApi } from './api'; // Import your teacher API functions
import toast from 'react-hot-toast'; // For notifications

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '', // Assuming this field exists in TeacherEntity
    subject: '',     // Assuming this field exists
    // Add other relevant teacher fields here
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: You MUST implement GET /teacher/all endpoint on your backend
      // to return a List<TeacherEntity> for this to work.
      const response = await teacherApi.getAllTeachers();
      setTeachers(response.data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to fetch teachers. Please check your backend endpoint /teacher/all.');
      toast.error('Failed to load teachers.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await teacherApi.updateTeacher(editingTeacher.id, formData);
        toast.success('Teacher updated successfully!');
      } else {
        await teacherApi.createTeacher(formData);
        toast.success('Teacher added successfully!');
      }
      setShowModal(false);
      setFormData({ name: '', email: '', phoneNumber: '', subject: '' }); // Reset form
      setEditingTeacher(null);
      fetchTeachers(); // Refresh list
    } catch (err) {
      console.error('Error saving teacher:', err.response?.data || err.message);
      toast.error(`Failed to save teacher: ${err.response?.data || err.message}`);
    }
  };

  const handleEditClick = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || '',
      email: teacher.email || '',
      phoneNumber: teacher.phoneNumber || '', // Assuming field name
      subject: teacher.subject || '',         // Assuming field name
      // ...map other fields
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherApi.deleteTeacher(teacherId);
        toast.success('Teacher deleted successfully!');
        fetchTeachers(); // Refresh list
      } catch (err) {
        console.error('Error deleting teacher:', err.response?.data || err.message);
        toast.error(`Failed to delete teacher: ${err.response?.data || err.message}`);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
    setFormData({ name: '', email: '', phoneNumber: '', subject: '' }); // Reset form
  };

  if (loading) return <div className="text-center p-6 text-lg">Loading teachers...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Teacher Management</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-md mb-6 hover:from-blue-600 hover:to-blue-800 transition duration-300 shadow-lg"
      >
        Add New Teacher
      </button>

      {/* Teacher List Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone Number</th>
              <th className="py-3 px-6 text-left">Subject</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <tr key={teacher.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{teacher.id}</td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">{teacher.name || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{teacher.email || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{teacher.phoneNumber || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{teacher.subject || 'N/A'}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditClick(teacher)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(teacher.id)}
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
                <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform scale-95 transition-transform duration-300 ease-out">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            <form onSubmit={handleAddEditSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-semibold mb-2">
                    Phone Number:
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 text-sm font-semibold mb-2">
                    Subject:
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                  />
                </div>
                {/* Add other fields as needed */}
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
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-md hover:from-blue-600 hover:to-blue-800 transition duration-150 shadow"
                >
                  {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;