import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './Pages/Home';
import Course from './Pages/Course';
import ShowCourse from './Pages/ShowCourse';
import Quiz from './Pages/Quiz';
import LoginForm from './Pages/Login';
import ForgotPasswordForm from './Pages/ForgotPasswordForm';
import SignupForm from './Pages/signup';
import UpdatePasswordForm from './Pages/UpdatePasswordForm';
import VerifyOtpForm from './Pages/VerifyOtpForm';
import TeacherHomePanel from './Pages/Teacherpanel';
import CourseUploadForm from './Pages/addcourse';
import CourseControlPanel from './Pages/viewcourse';
import ShowCourses from './Pages/ShowCourses';
import StudentProfile from './Pages/StudentProfile';
import Admin from './Pages/Admin';
import CourseDetailsUploadForm from './Pages/CourseDetailsUploadForm';
import TeacherProfile from './Pages/TeacherProfile';

// Components
import Navbar from './assets/components/Navbar';

const App = () => {
  return (
    <Router>
      {/* Navbar stays on all pages */}
      <Navbar />

      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/course" element={<Course />} />
        <Route path="/courselist" element={<ShowCourse />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/update-password" element={<UpdatePasswordForm />} />
        <Route path="/verify-otp" element={<VerifyOtpForm />} />
        <Route path="/verifyotp" element={<VerifyOtpForm />} />
        <Route path="/Teacherpanel" element={<TeacherHomePanel />} />
        <Route path="/courseupload" element={<CourseUploadForm />} />
        <Route path="/viewcourse" element={<CourseControlPanel />} />
        <Route path="/showcourse" element={<ShowCourses />} />
        <Route path="/student/:studentId" element={<StudentProfile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/detailsupload" element={<CourseDetailsUploadForm />} />
        <Route path="/teacherprofile" element={<TeacherProfile />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
};

export default App;
