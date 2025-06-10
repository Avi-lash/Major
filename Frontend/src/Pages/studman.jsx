// src/admin/components/StudentManagement.jsx
import React, { useState, useEffect } from 'react';
import { studentApi } from './api'; // Import your student API functions
import toast from 'react-hot-toast'; // For notifications

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null); // Student being edited
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phnno: '', // Assuming this field exists in StudentEntity
    address: '',     // Assuming this field exists
    // Add other relevant student fields here
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: You MUST implement GET /student/all endpoint on your backend
      // to return a List<StudentEntity> for this to work.
      const response = await studentApi.getAllStudents();
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students. Please check your backend endpoint /student/all.');
      toast.error('Failed to load students.');
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
      if (editingStudent) {
        await studentApi.updateStudent(editingStudent.id, formData);
        toast.success('Student updated successfully!');
      } else {
        await studentApi.createStudent(formData);
        toast.success('Student added successfully!');
      }
      setShowModal(false);
      setFormData({ name: '', email: '', phoneNumber: '', address: '' }); // Reset form
      setEditingStudent(null);
      fetchStudents(); // Refresh list
    } catch (err) {
      console.error('Error saving student:', err.response?.data || err.message);
      toast.error(`Failed to save student: ${err.response?.data || err.message}`);
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      phnno: student.phnno || '', // Assuming field name
      address: student.address || '',         // Assuming field name
      // ...map other fields from student object
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentApi.deleteStudent(studentId);
        toast.success('Student deleted successfully!');
        fetchStudents(); // Refresh list
      } catch (err) {
        console.error('Error deleting student:', err.response?.data || err.message);
        toast.error(`Failed to delete student: ${err.response?.data || err.message}`);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({ name: '', email: '', phoneNumber: '', address: '' }); // Reset form
  };

  if (loading) return <div className="text-center p-6 text-lg">Loading students...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6 from bg-purple-400 to bg-fuchsia-600 rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Student Management</h1>

      {/* Student List Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone Number</th>
              <th className="py-3 px-6 text-left">Address</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{student.id}</td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">{student.name || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{student.email || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{student.phoneNumber || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{student.address || 'N/A'}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditClick(student)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(student.id)}
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
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transform scale-95 transition-transform duration-300 ease-out">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
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
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150"
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
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150"
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
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2">
                    Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150"
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
                  className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-2 rounded-md hover:from-purple-600 hover:to-purple-800 transition duration-150 shadow"
                >
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;