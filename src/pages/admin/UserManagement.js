import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserManagement() {
  // State for users, error message, and user being edited
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState('');
  const navigate = useNavigate();

  // Fetch all users when component loads
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // If no token, redirect to login
        if (!token) {
          navigate('/login');
          return;
        }

        // Get users from the API
        const response = await axios.get('http://127.0.0.1:8080/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Set users in state if request is successful
        if (response.data.status === 'success') {
          setUsers(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        // Remove token if unauthorized and redirect to login
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          navigate('/login');
        }
        setError(err.response?.data?.message || 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, [navigate]);

  // Delete user from the system
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `http://127.0.0.1:8080/api/admin/users/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.status === 'success') {
          // Remove the deleted user from the list
          setUsers(users.filter(user => user.id !== userId));
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user');
      }
    }
  };

  // Update user's details
  const handleUpdate = async (userId) => {
    if (!newUsername || !newRole) {
      setError('Please fill out all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://127.0.0.1:8080/api/admin/users/${userId}`,
        {
          username: newUsername,
          role: newRole
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.status === 'success') {
        // Update user info in the list
        setUsers(users.map(user => user.id === userId ? { ...user, username: newUsername, role: newRole } : user));
        setEditingUser(null); // Stop editing mode
        setNewUsername('');
        setNewRole('');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/users/create')}
        >
          Create New User
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      {editingUser === user.id ? (
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="form-control"
                        />
                      ) : (
                        user.username
                      )}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="form-select"
                        >
                          <option value="admin">Admin</option>
                          <option value="employee">Employee</option>
                          <option value="student">Student</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      {editingUser === user.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleUpdate(user.id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingUser(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => {
                              setEditingUser(user.id);
                              setNewUsername(user.username);
                              setNewRole(user.role);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger me-2"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
