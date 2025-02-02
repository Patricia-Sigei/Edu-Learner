import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState({
    recentLessons: [],
    upcomingAssignments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/student/dashboard',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Student Dashboard</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Recent Lessons</h5>
            </div>
            <div className="card-body">
              {data.recentLessons.length === 0 ? (
                <p className="text-muted">No recent lessons</p>
              ) : (
                <div className="list-group">
                  {data.recentLessons.map(lesson => (
                    <Link 
                      key={lesson.id}
                      to={`/lessons/${lesson.id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-1">{lesson.title}</h6>
                        <small className="text-muted">
                          {new Date(lesson.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-header bg-warning">
              <h5 className="card-title mb-0">Upcoming Assignments</h5>
            </div>
            <div className="card-body">
              {data.upcomingAssignments.length === 0 ? (
                <p className="text-muted">No upcoming assignments</p>
              ) : (
                <div className="list-group">
                  {data.upcomingAssignments.map(assignment => (
                    <Link 
                      key={assignment.id}
                      to={`/assignments/${assignment.id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-1">{assignment.title}</h6>
                        <small className={`text-${
                          new Date(assignment.due_date) < new Date() 
                            ? 'danger' 
                            : 'warning'
                        }`}>
                          Due: {new Date(assignment.due_date).toLocaleDateString()}
                        </small>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;