import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

// Protected Route Component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Layout Component
function Layout() {
  return (
    <div className="App">
      <Navbar />
      <Outlet />
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          {/* Admin Routes */}
          <Route path="/admin">
            <Route path="users">
              <Route index element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="create" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <CreateUser />
                </ProtectedRoute>
              } />
            </Route>
          </Route>

          {/* Instructor Routes */}
          <Route path="/instructor">
            <Route 
              path="create-lesson" 
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <CreateLesson />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="create-assignment" 
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <CreateAssignment />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Student Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Common Protected Routes */}
          <Route 
            path="/lessons" 
            element={
              <ProtectedRoute>
                <LessonList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lessons/:id" 
            element={
              <ProtectedRoute>
                <LessonDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assignments" 
            element={
              <ProtectedRoute>
                <AssignmentList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assignments/:id" 
            element={
              <ProtectedRoute>
                <AssignmentDetail />
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route path="/" element={
            <Navigate to={
              !userRole ? '/login' :
              userRole === 'ADMIN' ? '/admin/users' :
              userRole === 'STUDENT' ? '/dashboard' :
              userRole === 'INSTRUCTOR' ? '/lessons' :
              '/login'
            } replace />
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;