import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Course from './Pages/Course';
import ShowCourse from './Pages/ShowCourse';
import Quiz from './Pages/Quiz';
import Home from './Pages/Home';
import Navbar from "./assets/components/Navbar";

function App() {
  return (
    <Router>
      {/* Navbar should be outside Routes to appear on every page */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course" element={<Course />} />
        <Route path="/courselist" element={<ShowCourse />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
