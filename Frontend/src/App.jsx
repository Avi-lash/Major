import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Course from './Pages/Course';
import ShowCourse from './Pages/ShowCourse';
import Home from './Pages/Home';
import Navbar from "./assets/components/Navbar";
import Quiz from './Pages/Quiz';
import LoginForm from './Pages/Login';
import ForgotPasswordForm from './Pages/ForgotPasswordForm'
import SignupForm from './Pages/signup'
import UpdatePasswordForm from './Pages/UpdatePasswordForm'
import VerifyOtpForm from './Pages/VerifyOtpForm'
import TeacherHomePanel from './Pages/Teacherpanel';
import CourseUploadForm from './Pages/addcourse';
import CourseControlPanel from './Pages/viewcourse';

function App() {
  return (
    <Router>
      {/* Navbar stays outside Routes so it shows on all pages */}
      <Navbar />

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/course" element={<Course />} />
        <Route path="/courselist" element={<ShowCourse />} />
        <Route path="/quiz" element={<Quiz />} /> {/* ✅ Dynamic ID passed */}
        <Route path="/login" element={<LoginForm /> }/>
        <Route path="/forgot-password" element={<ForgotPasswordForm />}/>
        <Route path="/signup" element={<SignupForm />}/>
        <Route path="/update-password" element={<UpdatePasswordForm />}/>
        <Route path="/verifyotp" element={<VerifyOtpForm />}/>
        <Route path="/Teacherpanel" element={<TeacherHomePanel />} />
        <Route path="/courseupload" element={<CourseUploadForm />} />
        <Route path="/viewcourse" element={<CourseControlPanel />} />
     </Routes>
    </Router>
  );
}

export default App;
