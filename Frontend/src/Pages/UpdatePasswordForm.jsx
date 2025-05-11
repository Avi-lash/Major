import React, { useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdatePasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      toast.error('Password must be at least 8 characters with 1 number and 1 special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const role = localStorage.getItem("userRole");

    if (!role) {
      toast.error("Please select a role during login.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint =
        role === "student"
          ? "http://localhost:8080/student/update-password"
          : "http://localhost:8080/teacher/update-password";

      const response = await axios.put(endpoint, {
        newPassword,
      });

      toast.success(response.data.message || "Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      localStorage.removeItem("userRole"); // Clean up
      navigate('/Login');
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong!";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.card}>
        <h4 style={styles.title}>Update Password</h4>
        <form onSubmit={handleSubmit}>
          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.field}>
            <svg style={styles.inputIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.61 8.31 6.33 10.07.49.29 1.07.43 1.67.43s1.18-.14 1.67-.43C19.39 20.31 22 16.41 22 12c0-5.52-4.48-10-10-10zm0 18c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
              <path d="M12 7c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path>
            </svg>
            <input
              type={passwordVisible ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              style={styles.inputField}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="off"
            />
            <button type="button" onClick={togglePasswordVisibility} style={styles.eyeBtn}>
              {passwordVisible ? "🙈" : "👁"}
            </button>
          </div>

          <div style={styles.field}>
            <svg style={styles.inputIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.61 8.31 6.33 10.07.49.29 1.07.43 1.67.43s1.18-.14 1.67-.43C19.39 20.31 22 16.41 22 12c0-5.52-4.48-10-10-10zm0 18c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path>
              <path d="M12 7c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path>
            </svg>
            <input
              type={passwordVisible ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              style={styles.inputField}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

const styles = {
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#1e1f2f",
    padding: "20px",
  },
  card: {
    backgroundColor: "#2a2b38",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#f5f5f5",
  },
  field: {
    position: "relative",
    marginBottom: "20px",
  },
  inputField: {
    width: "100%",
    padding: "12px 40px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#1f2029",
    color: "#fff",
  },
  inputIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fill: "#ffeba7",
    width: "20px",
    height: "20px",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#ffeba7",
    fontSize: "1.5em",
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "0",
    fontWeight: "normal",
  },
  btn: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
    marginBottom: "20px",
    textAlign: "center",
  },
};

export default UpdatePasswordForm;
