import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LessonList() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/lessons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLessons(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch lessons');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/instructor/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchLessons();
      } catch (err) {
        setError('Failed to delete lesson');
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lessons</h2>
        {userRole === 'INSTRUCTOR' && (
          <Link to="/lessons/create" className="btn btn-primary">
            Create New Lesson
          </Link>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        {lessons.map(lesson => (
          <div key={lesson.id} className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title">{lesson.title}</h5>
                <p className="card-text text-muted">
                  {lesson.description?.substring(0, 100)}...
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <Link 
                    to={`/lessons/${lesson.id}`} 
                    className="btn btn-outline-primary"
                  >
                    View Lesson
                  </Link>
                  {userRole === 'INSTRUCTOR' && (
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="btn btn-outline-danger"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LessonList;