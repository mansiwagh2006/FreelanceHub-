import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get('/applications/my-applications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(res.data);
      } catch (err) {
        toast.error('Failed to load your applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user.token]);

  const statusColor = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger',
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <p>You haven't applied to any projects yet.</p>
      ) : (
        applications.map((app) => (
          <div className="card mb-3" key={app._id}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h5 className="card-title">{app.project?.title || 'Project'}</h5>
                <span className={`badge bg-${statusColor[app.status]}`}>
                  {app.status}
                </span>
              </div>
              <p className="card-text">{app.proposal}</p>
              <p className="text-muted small">
                Your Rate: ₹{app.rate} | Budget: ₹{app.project?.budget} | Duration: {app.project?.duration}
              </p>
              {app.project?._id && (
                <Link to={`/projects/${app.project._id}`} className="btn btn-outline-primary btn-sm">
                  View Project
                </Link>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyApplications;