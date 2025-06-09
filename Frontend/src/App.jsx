import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// Core Pages
import Home from './Pages/Home';
import Course from './Pages/Course';
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
import TeacherProfile from './Pages/TeacherProfile';
import PayMethod from './Pages/PayMethod';
import Pay1 from './Pages/Pay1';
import Pay2 from './Pages/Pay2';
import Mycourse from './Pages/Mycourse';
import CourseStudent from './Pages/Course_student';
import EditProfile from './Pages/EditProfile';
import AssignmentGeneratorPage from './Pages/assignment';
import StudentManagement from './Pages/studman';
import TeacherManagement from './Pages/teacherman';
import CourseManagement from './Pages/courseman';
// Components
import Navbar from './assets/components/Navbar';
import VideoUpload from './Pages/VideoUpload';

const App = () => {
  return (
    <Router>
      <Toaster />
      <Navbar />

      <Routes>
        {/* Auth & Home Routes */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/update-password" element={<UpdatePasswordForm />} />
        <Route path="/verify-otp" element={<VerifyOtpForm />} />

        {/* Student & Teacher Panels */}
        <Route path="/home" element={<Home />} />
        <Route path="/teacherpanel" element={<TeacherHomePanel />} />
        <Route path="/teacherprofile" element={<TeacherProfile />} />
        <Route path="/student/:studentId" element={<StudentProfile />} />
        <Route path="/mycourse/:studentId" element={<Mycourse />} />

        {/* Course Pages */}
        <Route path="/course" element={<Course />} />
        <Route path="/courselist" element={<ShowCourses />} />
        <Route path="/showcourse" element={<ShowCourses />} />
        <Route path="/courseupload" element={<CourseUploadForm />} />
        <Route path="/viewcourse" element={<CourseControlPanel />} />

        {/* Admin & Payment */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/studentadmin" element={<StudentManagement />}/>
        <Route path="/teacheradmin" element={<TeacherManagement />}/>
        <Route path="/courseadmin" element={<CourseManagement />}/>
        <Route path="/paymethod" element={<PayMethod />} />
        <Route path="/pay1" element={<Pay1 />} />
        <Route path="/pay2" element={<Pay2 />} />
        <Route path="/coursestudents" element={<CourseStudent />} />
        <Route path="/edit_profile" element={<EditProfile />} />

        {/* Quiz */}
        <Route path="/quiz/:courseId" element={<Quiz />} />

        {/* Video Upload Route */}
        <Route path="/upload/:courseId" element={<UploadWrapper />} />
        { <Route path="/generate-assignment" element={<AssignmentGeneratorPage />} />}



        {/* Redirect Route */}
        <Route path="/redirect" element={<HomeRedirect />} />
      </Routes>
    </Router>
  );
};

function UploadWrapper() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) {
      navigate('/home'); // safer to redirect to home instead of '/'
    }
  }, [courseId, navigate]);

  if (!courseId) return null; // can show spinner or message if you want

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-start pt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center drop-shadow-lg mb-8">
        Video Upload Platform
      </h2>
      <VideoUpload
        courseId={courseId}
        onUploadSuccess={() => {
          navigate('/home');
        }}
      />
    </div>
  );
}

function HomeRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/home');
  }, [navigate]);
  return null;
}

export default App;
