import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Course from './Pages/Course';
import ShowCourse from './Pages/ShowCourse';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Course />} />
        <Route path="/courselist" element={<ShowCourse />} />
      </Routes>
    </Router>
  );
}

export default App;
