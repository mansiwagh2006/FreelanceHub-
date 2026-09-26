import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState('');
  const [rate, setRate] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await API.get(`/project/${id}`);
        setProject(res.data);
      } catch (err) {
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await API.post(
        '/applications',
        { projectId: id, proposal, rate, portfolioLink },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Application submitted!');
      setProposal('');
      setRate('');
      setPortfolioLink('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!project) return <div className="text-center mt-5">Project not found</div>;

  const isOwner = project.client?._id === user.userId;

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <div className="d-flex justify-content-between align-items-start">
        <h2>{project.title}</h2>
        <Link to={`/chat/${project._id}`} className="btn btn-outline-secondary btn-sm">
          Open Chat
        </Link>
      </div>
      <p>{project.description}</p>
      <p><strong>Budget:</strong> ₹{project.budget}</p>
      <p><strong>Duration:</strong> {project.duration}</p>
      <p><strong>Skills Required:</strong> {project.skillsRequired?.join(', ')}</p>
      <p><strong>Posted by:</strong> {project.client?.name}</p>

      {user.role === 'freelancer' && !isOwner && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Apply for this project</h5>
            <form onSubmit={handleApply}>
              <div className="mb-3">
                <label className="form-label">Proposal</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Your Rate (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Portfolio Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={applying}>
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;