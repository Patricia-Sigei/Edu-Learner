import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0099cc' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">EduLearn</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {isLoggedIn && (
            <ul className="navbar-nav me-auto">
              {userRole === 'STUDENT' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
              )}
              
              {userRole === 'INSTRUCTOR' && (
                <li className="nav-item dropdown">
                  <button 
                    className="nav-link dropdown-toggle bg-transparent border-0" 
                    id="instructorDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    type="button"
                  >
                    Instructor
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="instructorDropdown">
                    <li>
                      <Link className="dropdown-item" to="/instructor/create-lesson">
                        Create Lesson
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/instructor/create-assignment">
                        Create Assignment
                      </Link>
                    </li>
                  </ul>
                </li>
              )}

              {userRole === 'ADMIN' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">Manage Users</Link>
                </li>
              )}

              <li className="nav-item">
                <Link className="nav-link" to="/lessons">Lessons</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/assignments">Assignments</Link>
              </li>
            </ul>
          )}
          
          <div className="d-flex align-items-center">
            {isLoggedIn ? (
              <div className="d-flex align-items-center">
                <span className="text-light me-3">
                  {userRole && `${userRole.charAt(0) + userRole.slice(1).toLowerCase()}`}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-light"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-light">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;