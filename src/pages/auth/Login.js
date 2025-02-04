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
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetData, setResetData] = useState({
    old_password: '',
    new_password: ''
  });
  const [resetMessage, setResetMessage] = useState('');

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
      const response = await axios.post('http://127.0.0.1:8080/api/auth/login', formData);
      console.log('Login response:', response.data);

      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role);
        redirectBasedOnRole(user.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8080/api/auth/reset-password',
        resetData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResetMessage(response.data.message);
      setResetData({ old_password: '', new_password: '' });
      setShowResetModal(false);
    } catch (err) {
      setResetMessage(err.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>

              {error && <div className="alert alert-danger">{error}</div>}

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

              <p className="mt-3 text-center">
                <button className="btn btn-link" onClick={() => setShowResetModal(true)}>
                New users? Reset Password.
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showResetModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reset Password</h5>
                <button className="btn-close" onClick={() => setShowResetModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleResetPassword}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="old_password"
                      value={resetData.old_password}
                      onChange={(e) => setResetData({ ...resetData, old_password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="new_password"
                      value={resetData.new_password}
                      onChange={(e) => setResetData({ ...resetData, new_password: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Reset Password
                  </button>
                </form>

                {resetMessage && <div className="alert mt-3">{resetMessage}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
