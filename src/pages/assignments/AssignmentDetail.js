import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState('');
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('userRole');

  const fetchAssignment = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignment(response.data);
      if (response.data.submission) {
        setSubmission(response.data.submission);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/student/assignments/${id}/submit`,
        { submission },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/assignments');
    } catch (err) {
      
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!assignment) return <div className="text-center mt-5">Assignment not found</div>;

  const isOverdue = new Date(assignment.due_date) < new Date();

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="mb-4">{assignment.title}</h2>
          
          <div className="mb-4">
            <h5>Description</h5>
            <p className="text-muted">{assignment.description}</p>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h5>
                {userRole === 'STUDENT' ? 'Your Submission' : 'Assignment Details'}
              </h5>
              <small className={`text-${isOverdue ? 'danger' : 'muted'}`}>
                Due: {new Date(assignment.due_date).toLocaleString()}
              </small>
            </div>

            {userRole === 'STUDENT' && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="5"
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                    placeholder="Enter your submission here..."
                    required
                    disabled={isOverdue || assignment.status === 'graded'}
                  />
                </div>

                {assignment.status === 'graded' ? (
                  <div className="alert alert-info">
                    <strong>Grade: {assignment.grade}</strong>
                    <p className="mb-0">Feedback: {assignment.feedback}</p>
                  </div>
                ) : (
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isOverdue}
                    >
                      Submit Assignment
                    </button>
                  </div>
                )}
              </form>
            )}

            {userRole === 'INSTRUCTOR' && (
              <div className="mt-3">
                <Link 
                  to={`/assignments/${id}/submissions`}
                  className="btn btn-primary"
                >
                  View Submissions
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentDetail;
