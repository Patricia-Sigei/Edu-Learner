import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8080/api/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch assignments');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Assignments</h2>
        {userRole === 'INSTRUCTOR' && (
          <Link to="/assignments/create" className="btn btn-primary">
            Create Assignment
          </Link>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        {assignments.map(assignment => (
          <div key={assignment.id} className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">{assignment.title}</h5>
                <p className="card-text">{assignment.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </small>
                  <Link 
                    to={`/assignments/${assignment.id}`} 
                    className="btn btn-outline-primary"
                  >
                    {userRole === 'STUDENT' ? 'Submit' : 'View Details'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssignmentList;