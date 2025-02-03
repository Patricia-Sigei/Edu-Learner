import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'ADM-001',
    password: 'Admin@123'
  });
  const [error, setError] = useState('');

  const redirectBasedOnRole = useCallback((role) => {
    switch (role) {
      case 'ADMIN':
        navigate('/admin/users', { replace: true });
        break;
      case 'INSTRUCTOR':
        navigate('/lessons', { replace: true });
        break;
      case 'STUDENT':
        navigate('/dashboard', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      redirectBasedOnRole(role);
    }
  }, [redirectBasedOnRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post(
        'http://127.0.0.1:8080/api/auth/login',  
        formData
      );
      console.log('Login response:', response.data);

      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role);
        console.log('Stored token:', token);
        console.log('Stored role:', user.role);
        redirectBasedOnRole(user.role);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;