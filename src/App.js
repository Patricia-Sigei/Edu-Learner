import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import UserManagement from './pages/admin/UserManagement';
import CreateUser from './pages/admin/CreateUser';
import CreateLesson from './pages/instructor/CreateLesson';
import CreateAssignment from './pages/instructor/CreateAssignment';
import Dashboard from './pages/student/Dashboard';
import LessonList from './pages/lessons/LessonList';
import LessonDetail from './pages/lessons/LessonDetail';
import AssignmentList from './pages/assignments/AssignmentList';
import AssignmentDetail from './pages/assignments/AssignmentDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/users" 
            element={userRole === 'ADMIN' ? <UserManagement /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/create-user" 
            element={userRole === 'ADMIN' ? <CreateUser /> : <Navigate to="/login" />} 
          />
          
          {/* Instructor Routes */}
          <Route 
            path="/lessons/create" 
            element={userRole === 'INSTRUCTOR' ? <CreateLesson /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/assignments/create" 
            element={userRole === 'INSTRUCTOR' ? <CreateAssignment /> : <Navigate to="/login" />} 
          />
          
          {/* Student Dashboard */}
          <Route 
            path="/dashboard" 
            element={userRole === 'STUDENT' ? <Dashboard /> : <Navigate to="/login" />} 
          />
          
          {/* Common Routes */}
          <Route path="/lessons" element={<LessonList />} />
          <Route path="/lessons/:id" element={<LessonDetail />} />
          <Route path="/assignments" element={<AssignmentList />} />
          <Route path="/assignments/:id" element={<AssignmentDetail />} />
          
          {/* Default Route */}
          <Route path="/" element={
            !userRole ? <Navigate to="/login" /> : 
            userRole === 'STUDENT' ? <Navigate to="/dashboard" /> :
            <Navigate to="/lessons" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;