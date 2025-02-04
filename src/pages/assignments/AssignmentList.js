import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AssignmentList() {
  // State to hold assignments, loading, and error messages
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('userRole');

  // Function to fetch assignments from the API
  const fetchAssignments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';

      // Set the API endpoint based on user role
      if (userRole === 'INSTRUCTOR') {
        endpoint = 'http://127.0.0.1:8080/api/instructor/assignments';
      } else if (userRole === 'STUDENT') {
        endpoint = 'http://127.0.0.1:8080/api/student/assignments';
      } else if (userRole === 'ADMIN') {
        endpoint = 'http://127.0.0.1:8080/api/admin/assignments';
      }

      // Make the API request
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Set assignments and stop loading once the data is fetched
      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setError('No assignments available');
        }
        setAssignments(response.data);
      } else {
        setError('Assignments data is not in the expected format');
      }
      setLoading(false);
    } catch (err) {
      // Handle any errors that occur during fetching
      setError('Failed to fetch assignments');
      setLoading(false);
    }
  }, [userRole]);

  // Fetch assignments on component mount
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Display loading message while data is being fetched
  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      {/* Header with the title and button to create assignment for instructors */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Assignments</h2>
        {userRole === 'INSTRUCTOR' && (
          <Link to="/assignments/create" className="btn btn-primary">
            Create Assignment
          </Link>
        )}
      </div>

      {/* Display error message if there was an error fetching the data */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Render the list of assignments */}
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
