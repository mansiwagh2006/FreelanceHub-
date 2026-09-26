import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function ManageApplications() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await API.get(`/applications/project/${projectId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplications(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [projectId]);

  const handleStatusUpdate = async (appId, status) => {
    try {
      await API.patch(
        `/applications/${appId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const statusColor = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger',
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <button className="btn btn-link ps-0 mb-2" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>
      <h2 className="mb-4">Applications Received</h2>
      {applications.length === 0 ? (
        <p>No applications yet for this project.</p>
      ) : (
        applications.map((app) => (
          <div className="card mb-3" key={app._id}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <h5 className="card-title">{app.freelancer?.name}</h5>
                <span className={`badge bg-${statusColor[app.status]}`}>
                  {app.status}
                </span>
              </div>
              <p className="text-muted small">{app.freelancer?.email}</p>
              <p className="card-text">{app.proposal}</p>
              <p className="text-muted small">
                Rate: ₹{app.rate}
                {app.portfolioLink && (
                  <> | <a href={app.portfolioLink} target="_blank" rel="noreferrer">Portfolio</a></>
                )}
              </p>
              {app.status === 'pending' && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleStatusUpdate(app._id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusUpdate(app._id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageApplications;
