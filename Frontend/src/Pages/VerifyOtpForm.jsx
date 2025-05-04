import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
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
  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "1.5rem",
  },
  otpInput: {
    width: "40px",
    height: "50px",
    fontSize: "20px",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: "#2d2d2d",
    color: "white",
    border: "none",
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
};

const VerifyOtpForm = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputsRef.current[5].focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (!/^\d{6}$/.test(code)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

   

    try {

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole") || "teacher"; // Fallback to teacher

      if (!token || !role) {
        toast.error("Please select role during login");
        navigate("/login"); // or redirect to forgot-password if that's more appropriate
        return;
      }
  
      const endpoint =
        role === "student"
          ? "http://localhost:8080/student/verify-otp"
          : "http://localhost:8080/teacher/verify-otp";
      const res = await axios.post(endpoint, { otp: code, token: token });
      if (res.data.status === "success") {
        toast.success(res.data.message || "OTP verified successfully!");
        localStorage.removeItem("token");
        navigate("/update-password");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <div style={styles.card}>
        <h4 style={styles.title}>Verify OTP</h4>
        <form onSubmit={handleSubmit} onPaste={handlePaste}>
          <div style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                style={styles.otpInput}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
              />
            ))}
          </div>
          <button type="submit" style={styles.btn}>
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
