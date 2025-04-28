import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Course from './Pages/Course';
import ShowCourse from './Pages/ShowCourse';
import Quiz from './Pages/Quiz';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Course />} />
        <Route path="/courselist" element={<ShowCourse />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
