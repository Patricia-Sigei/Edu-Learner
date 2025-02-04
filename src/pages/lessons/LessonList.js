import { useState, useEffect, useCallback } from "react"; 
import { Link } from "react-router-dom";
import axios from "axios";

function LessonList() {
  const [lessons, setLessons] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userRole = localStorage.getItem("userRole");

  // Wrap fetchLessons in useCallback to avoid unnecessary re-renders
  const fetchLessons = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      let endpoint = "";

      if (userRole === "ADMIN") {
        endpoint = "http://127.0.0.1:8080/api/admin/lessons";
      } else if (userRole === "INSTRUCTOR") {
        endpoint = "http://127.0.0.1:8080/api/instructor/lessons";
      } else if (userRole === "STUDENT") {
        endpoint = "http://127.0.0.1:8080/api/student/lessons";
      } else {
        setError("Unauthorized access");
        setLoading(false);
        return;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);

      // Access 'data' from the response object
      if (response.data.status === "success" && Array.isArray(response.data.data)) {
        setLessons(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setLessons([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching lessons:", err);
      setError("Failed to fetch lessons");
      setLoading(false);
    }
    // Add userRole as a dependency
  }, [userRole]); 

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]); 

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://127.0.0.1:8080/api/instructor/lessons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchLessons();
      } catch (err) {
        console.error("Error deleting lesson:", err);
        setError("Failed to delete lesson");
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lessons</h2>
        {userRole === "INSTRUCTOR" && (
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
        {Array.isArray(lessons) && lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div key={lesson.id} className="col-md-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">{lesson.title}</h5>
                  <p className="card-text text-muted">
                    {lesson.description?.substring(0, 100)}...
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to={`/lessons/${lesson.id}`} className="btn btn-outline-primary">
                      View Lesson
                    </Link>
                    {userRole === "INSTRUCTOR" && (
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
          ))
        ) : (
          <p>No lessons available.</p>
        )}
      </div>
    </div>
  );
}

export default LessonList;
