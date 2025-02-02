import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
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
              <li className="nav-item">
                <Link className="nav-link" to="/lessons">Lessons</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/assignments">Assignments</Link>
              </li>
              {userRole === 'ADMIN' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">Manage Users</Link>
                </li>
              )}
            </ul>
          )}
          
          <div className="d-flex">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="btn btn-light"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn btn-light">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;