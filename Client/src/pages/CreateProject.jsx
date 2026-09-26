import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function CreateProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    budget: '',
    duration: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        budget: Number(formData.budget),
        skillsRequired: formData.skillsRequired
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      await API.post('/project', payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      toast.success('Project posted successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Post a New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Skills Required (comma-separated)</label>
          <input
            type="text"
            name="skillsRequired"
            className="form-control"
            placeholder="e.g. Photoshop, Illustrator"
            value={formData.skillsRequired}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Budget (₹)</label>
          <input
            type="number"
            name="budget"
            className="form-control"
            value={formData.budget}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Duration</label>
          <input
            type="text"
            name="duration"
            className="form-control"
            placeholder="e.g. 1 week"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Project'}
        </button>
      </form>
    </div>
  );
}

export default CreateProject;