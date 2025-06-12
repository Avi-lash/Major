import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../assets/small.jpg';
import axios from 'axios'; // Ensure axios is installed: npm install axios or yarn add axios

function Certificate() {
  const certificateRef = useRef(null);
  const location = useLocation();

  // Extract studentId and courseId passed via navigate's state
  // Provide an empty object as a fallback if location.state is undefined,
  // preventing destructuring errors.
  const { studentId, courseId } = location.state || {};

  // State to hold the fetched data and control UI feedback
  const [userName, setUserName] = useState("Loading Name...");
  const [courseName, setCourseName] = useState("Loading Course...");
  const [loadingNames, setLoadingNames] = useState(true); // Tracks if name fetching is in progress
  const [fetchError, setFetchError] = useState(null); // Stores any error during name fetching

  // --- useEffect hook for fetching user and course names ---
  // This effect runs when the component mounts or when studentId/courseId change.
  useEffect(() => {
    const fetchNames = async () => {
      // 1. Basic validation: Ensure IDs are present before making API calls.
      if (!studentId || !courseId) {
        setFetchError("Certificate details are missing. Please navigate from My Courses page.");
        setLoadingNames(false);
        return; // Stop execution if IDs are missing
      }

      setLoadingNames(true); // Indicate loading has started
      setFetchError(null); // Clear previous errors

      try {
   
    const userRes = await axios.get(`http://localhost:8080/student/${studentId}`);

    setUserName(userRes.data.firstName || userRes.data.name || "Unknown User");
    console.log("User Name Fetched:", userRes.data.firstName || userRes.data.name);

   
    const courseRes = await axios.get(`http://localhost:8080/api/v1/courses/${courseId}`);

    // Your CourseController's getCourseById explicitly returns 'courseName' in the map.
    setCourseName(courseRes.data.courseName || "Unknown Course");
    console.log("Course Name Fetched:", courseRes.data.courseName);

} catch (err) {
    console.error("Error fetching names for certificate:", err);
    setFetchError("Failed to load certificate details. Please check server connections.");
    setUserName("Error Loading Name");
    setCourseName("Error Loading Course");
}

finally {
        // This 'finally' block ensures setLoadingNames(false) is called
        // regardless of whether the try block succeeded or the catch block was hit.
        setLoadingNames(false);
      }

    };

    fetchNames(); // Call the async function
  }, [studentId, courseId]); // Dependency array: Effect re-runs if studentId or courseId changes

  // --- Styles - These are the inline styles needed for html2canvas compatibility ---
  // Ensure these are outside the component or memoized if they don't change
  const structuralStyles = {
    outerContainer: `
      flex flex-col items-center justify-center min-h-screen
      font-['Segoe_UI'] font-sans
      p-4
    `,
    certificateBox: `
      w-[800px] mx-auto my-[50px] p-[40px]
      relative overflow-hidden
      border-[10px] border-[#e0e0e0] shadow-md
      box-border
      max-w-[95%]
      md:my-5 md:p-6
      sm:my-4 sm:p-4
      sm:border-[5px]
    `,
    logoSection: `
      text-center mt-[20px]
    `,
    logoImg: `
      w-[120px] mx-auto h-auto
      max-w-full
      sm:w-[100px]
    `,
    contentSection: `
      text-center py-[30px] px-[20px]
    `,
    downloadButton: `
      mt-8 px-6 py-3 font-bold rounded-lg shadow-lg
      hover:opacity-90 transition duration-300 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-opacity-75
    `,
    headingSize: `
      text-[32px] md:text-[28px] sm:text-[24px]
    `,
    courseNameSize: `
      text-[22px] md:text-[18px] sm:text-[16px]
    `,
    studentNameSize: `
      text-[26px] md:text-[22px] sm:text-[20px]
    `,
    infoTextSize: `
      text-[16px] sm:text-[14px]
    `,
    contactInfoSize: `
      text-[14px] sm:text-[12px]
    `
  };

  const explicitInlineStyles = {
    outerContainerBackground: {
      backgroundColor: 'rgb(224, 240, 255)'
    },
    certificateBackground: {
      background: 'linear-gradient(135deg, rgb(216, 191, 216), rgb(255, 224, 240), rgb(255, 250, 205))',
    },
    topBar: {
      background: 'linear-gradient(135deg, rgb(128, 0, 128), rgb(0, 0, 0))',
      height: '60px',
      clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
    },
    bottomBar: {
      background: 'linear-gradient(135deg, rgb(0, 0, 0), rgb(128, 0, 128))',
      height: '60px',
      clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    blackText: {
      color: 'rgb(0, 0, 0)'
    },
    purpleText: {
      color: 'rgb(128, 0, 128)'
    },
    darkGrayText: {
      color: 'rgb(51, 51, 51)'
    },
    mediumGrayText: {
      color: 'rgb(85, 85, 85)'
    },
    downloadButtonColors: {
      backgroundColor: 'rgb(5, 150, 105)',
      color: 'rgb(255, 255, 255)'
    },
    headingMargin: {
      marginTop: '20px',
      marginBottom: '10px'
    },
    courseNameMargin: {
      marginBottom: '20px'
    },
    studentNameMargin: {
      margin: '20px 0'
    },
    infoTextMargin: {
      margin: '20px auto 40px',
      maxWidth: '600px'
    },
    contactInfoMargin: {
      marginTop: '60px'
    }
  };

  // --- PDF Download Function ---
  const downloadPdf = async () => {
    if (!certificateRef.current) {
      console.error("Certificate element not found for PDF conversion.");
      return;
    }

    const downloadButton = document.getElementById('downloadPdfButton');
    if (downloadButton) {
      downloadButton.style.display = 'none'; // Temporarily hide the button during capture
    }

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // Higher scale for better resolution in PDF
        useCORS: true, // Crucial for loading images from different origins if applicable
        logging: true, // Enable logging for debugging html2canvas issues
        allowTaint: true, // Allows drawing cross-origin images onto the canvas, though it taints it
        backgroundColor: null, // Ensures transparent background is handled correctly
      });

      const imgData = canvas.toDataURL('image/png'); // Get image data as PNG
      const pdf = new jsPDF({
        orientation: 'landscape', // Set PDF orientation
        unit: 'px', // Use pixels as unit
        format: [canvas.width, canvas.height], // Set PDF format to match canvas size
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height); // Add image to PDF
      pdf.save(`Certificate_${userName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}.pdf`); // Save PDF with dynamic name
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please ensure all content is loaded and try again.");
    } finally {
      if (downloadButton) {
        downloadButton.style.display = 'block'; // Show the button again
      }
    }
  };

  // --- Conditional Rendering based on loading/error states ---
  if (loadingNames) {
    return (
      <div className={structuralStyles.outerContainer} style={explicitInlineStyles.outerContainerBackground}>
        <div className="text-xl text-gray-700">Loading certificate details...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className={structuralStyles.outerContainer} style={explicitInlineStyles.outerContainerBackground}>
        <div className="text-xl text-red-600">{fetchError}</div>
      </div>
    );
  }

  // --- Main Certificate Content (rendered after names are fetched) ---
  return (
    <div
      className={structuralStyles.outerContainer}
      style={explicitInlineStyles.outerContainerBackground}
    >
      <div
        ref={certificateRef}
        className={structuralStyles.certificateBox}
        style={explicitInlineStyles.certificateBackground}
      >
        {/* Top Bar */}
        <div style={explicitInlineStyles.topBar}></div>

        {/* Logo Section */}
        <div className={structuralStyles.logoSection}>
          <img
            src={logo}
            alt="Learnexa Logo"
            className={structuralStyles.logoImg}
          />
        </div>

        {/* Certificate Content */}
        <div className={structuralStyles.contentSection}>
          <h1
            className={structuralStyles.headingSize + ' font-bold'}
            style={{ ...explicitInlineStyles.blackText, ...explicitInlineStyles.headingMargin }}
          >
            CERTIFICATE OF COMPLETION
          </h1>
          <div
            className={structuralStyles.courseNameSize}
            style={{ ...explicitInlineStyles.purpleText, ...explicitInlineStyles.courseNameMargin }}
          >
            {courseName} {/* Display fetched course name */}
          </div>
          <div
            className={structuralStyles.studentNameSize + ' font-bold'}
            style={{ ...explicitInlineStyles.blackText, ...explicitInlineStyles.studentNameMargin }}
          >
            {userName} {/* Display fetched user name */}
          </div>
          <p
            className={structuralStyles.infoTextSize}
            style={{ ...explicitInlineStyles.darkGrayText, ...explicitInlineStyles.infoTextMargin }}
          >
            In recognition of successfully completing the above course with dedication and excellence.
            This certificate is awarded with full acknowledgment of the effort and skill demonstrated.
          </p>

          <div
            className={structuralStyles.contactInfoSize + ' text-center'}
            style={{ ...explicitInlineStyles.mediumGrayText, ...explicitInlineStyles.contactInfoMargin }}
          >
            Contact: contact@learnexa.org | +91-9876543210
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={explicitInlineStyles.bottomBar}></div>
      </div>

      <button
        id="downloadPdfButton"
        onClick={downloadPdf}
        className={structuralStyles.downloadButton}
        style={explicitInlineStyles.downloadButtonColors}
      >
        Download Certificate (PDF)
      </button>
    </div>
  );
}

export default Certificate;