import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const endpoint = user.role === 'client' ? '/project/my-projects' : '/project';
        const res = await API.get(endpoint, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProjects(res.data);
      } catch (err) {
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user.role, user.token]);

  if (loading) {
    return <div className="text-center mt-5">Loading projects...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {user.role === 'client' ? 'Your Dashboard' : 'Browse Projects'}
        </h2>
        {user.role === 'client' && (
          <Link to="/create-project" className="btn btn-primary">
            + Post New Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <p>No projects found yet.</p>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div className="col-md-4 mb-4" key={project._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{project.title}</h5>
                  <p className="card-text">{project.description}</p>
                  <p className="text-muted small">
                    Budget: ₹{project.budget} | Duration: {project.duration}
                  </p>
                  <div className="d-flex gap-2">
                    <Link to={`/projects/${project._id}`} className="btn btn-outline-primary btn-sm">
                      View Details
                    </Link>
                    {user.role === 'client' && (
                      <Link to={`/manage-applications/${project._id}`} className="btn btn-outline-secondary btn-sm">
                        Manage Applications
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;