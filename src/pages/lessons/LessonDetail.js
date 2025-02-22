import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('userRole');

  const fetchLesson = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';

      if (userRole === 'ADMIN') {
        endpoint = `http://127.0.0.1:8080/api/admin/lessons/${id}`;
      } else if (userRole === 'INSTRUCTOR') {
        endpoint = `http://127.0.0.1:8080/api/instructor/lessons/${id}`;
      } else if (userRole === 'STUDENT') {
        endpoint = `http://127.0.0.1:8080/api/student/lessons/${id}`;
      } else {
        setError('Unauthorized access');
        setLoading(false);
        return;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);

      // Handle response format: status and data
      if (response.data.status === 'success' && response.data.data) {
        setLesson(response.data.data);
      } else {
        setError('Lesson not found or invalid response');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching lesson:', err);
      setError('Failed to fetch lesson');
      setLoading(false);
    }
  }, [id, userRole]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!lesson) return <div className="text-center mt-5">Lesson not found</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{lesson.title}</h2>
            {userRole === 'INSTRUCTOR' && (
              <div>
                <button 
                  onClick={() => navigate(`/lessons/${id}/edit`)}
                  className="btn btn-primary me-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => navigate('/lessons')}
                  className="btn btn-secondary"
                >
                  Back
                </button>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h5>Description</h5>
            <p className="text-muted">{lesson.description}</p>
          </div>

          <div className="lesson-content">
            <h5>Content</h5>
            <div className="p-4 bg-light rounded">
              {lesson.content}
            </div>
          </div>

          {lesson.due_date && (
            <div className="mt-3">
              <small className="text-muted">
                Due: {new Date(lesson.due_date).toLocaleString()}
              </small>
            </div>
          )}
        </div>
      </div>

      {/* Related Assignments Section */}
      {lesson.assignments && lesson.assignments.length > 0 && (
        <div className="mt-4">
          <h4>Related Assignments</h4>
          <div className="list-group">
            {lesson.assignments.map(assignment => (
              <div 
                key={assignment.id} 
                className="list-group-item list-group-item-action"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{assignment.title}</h6>
                    <small className="text-muted">
                      Due: {new Date(assignment.due_date).toLocaleString()}
                    </small>
                  </div>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/assignments/${assignment.id}`)}
                  >
                    View Assignment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonDetail;
