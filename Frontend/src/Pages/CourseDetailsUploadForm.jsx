import React, { useState } from "react";

const CourseDetailsUploadForm = () => {
  const [formData, setFormData] = useState({
    video: null,
    assignment: null,
  });

  const handleChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can now use formData.video and formData.assignment to send data to backend
    console.log("Video File:", formData.video);
    console.log("Assignment File:", formData.assignment);
    alert("Files submitted successfully!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Upload Course Details</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Upload Course Video:</label>
        <input
          type="file"
          name="video"
          accept="video/*"
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Upload Assignment Document:</label>
        <input
          type="file"
          name="assignment"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

// Internal CSS
const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    marginBottom: "20px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  }
};

export default CourseDetailsUploadForm;

