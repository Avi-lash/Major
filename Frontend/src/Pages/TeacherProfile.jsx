import React, { useRef, useState } from 'react';

const TeacherProfile = () => {
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div
            className="relative w-40 h-40 rounded-full border-4 border-cyan-400 overflow-hidden cursor-pointer hover:opacity-80 transition"
            onClick={handleImageClick}
            title="Click to change profile picture"
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold !text-white mb-2">Prof. Ayesha Sharma</h2>
        <p className="text-base mb-1"><strong>📞 Phone:</strong> +91 98765 43210</p>
        <p className="text-base"><strong>✉️ Email:</strong> ayesha.sharma@example.com</p>
      </div>
    </div>
  );
};

export default TeacherProfile;
