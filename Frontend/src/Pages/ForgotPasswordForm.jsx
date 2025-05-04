import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    try {

      const role = localStorage.getItem("userRole") || "teacher"; // 🔑 Get role from localStorage
    const endpoint = `http://localhost:8080/${role}/forgot-password`;
     if (!role) {
             toast.error("Please select role during login");
             navigate("/login"); // or redirect to forgot-password if that's more appropriate
             return;
           }
       
      const res = await axios.post(
        endpoint,
        { email },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.status === "success") {
        toast.success('Password reset link sent to your email.');
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", email);
        navigate('/verify-otp');
      }
    } catch (err) {
      toast.error('Something went wrong, please try again later.');
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw", // fixed width bug from 100vh to 100vw
      backgroundColor: "#1e1f2f",
    },
    card: {
      width: "320px",
      padding: "2rem 1.5rem",
      textAlign: "center",
      background: "#2a2b38",
      borderRadius: "10px",
    },
    title: {
      marginBottom: "1.5rem",
      fontSize: "1.5em",
      fontWeight: "500",
      color: "#f5f5f5",
    },
    field: {
      marginTop: ".5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: ".5em",
      backgroundColor: "#1f2029",
      borderRadius: "4px",
      padding: ".5em 1em",
    },
    inputIcon: {
      height: "1.5em",
      width: "1.5em",
      fill: "#ffeba7",
    },
    inputField: {
      background: "none",
      border: "none",
      outline: "none",
      width: "100%",
      color: "#d3d3d3",
      fontSize: "1em",
    },
    btn: {
      margin: "1rem 0",
      border: "none",
      borderRadius: "4px",
      fontWeight: "bold",
      fontSize: ".8em",
      textTransform: "uppercase",
      padding: "0.6em 1.2em",
      backgroundColor: "#ffeba7",
      color: "#5e6681",
      boxShadow: "0 8px 24px 0 rgb(255 235 167 / 20%)",
      transition: "all .3s ease-in-out",
      cursor: "pointer",
    },
    link: {
      marginTop: "1rem",
      fontSize: "0.9em",
      color: "#b0b0b0",
    },
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.card}>
        <h4 style={styles.title}>Forgot Password</h4>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <svg style={styles.inputIcon} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <path d="M207.8 20.73c-93.45 18.32-168.7 93.66-187 187.1c-27.64 140.9 68.65 266.2 199.1 285.1c19.01 2.888 36.17-12.26 36.17-31.49l.0001-.6631c0-15.74-11.44-28.88-26.84-31.24c-84.35-12.98-149.2-86.13-149.2-174.2c0-102.9 88.61-185.5 193.4-175.4c91.54 8.869 158.6 91.25 158.6 183.2l0 16.16c0 22.09-17.94 40.05-40 40.05s-40.01-17.96-40.01-40.05v-120.1c0-8.847-7.161-16.02-16.01-16.02l-31.98 .0036c-7.299 0-13.2 4.992-15.12 11.68c-24.85-12.15-54.24-16.38-86.06-5.106c-38.75 13.73-68.12 48.91-73.72 89.64c-9.483 69.01 43.81 128 110.9 128c26.44 0 50.43-9.544 69.59-24.88c24 31.3 65.23 48.69 109.4 37.49C465.2 369.3 496 324.1 495.1 277.2V256.3C495.1 107.1 361.2-9.332 207.8 20.73zM239.1 304.3c-26.47 0-48-21.56-48-48.05s21.53-48.05 48-48.05s48 21.56 48 48.05S266.5 304.3 239.1 304.3z"></path>
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email"
              style={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
            />
          </div>
          <button style={styles.btn} type="submit">Send Reset Link</button>
        </form>
        <div style={styles.link}>
          <p>Remembered your password? <a href="/login" className="text-blue-400 hover:underline">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
