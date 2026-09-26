import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { toast } from 'react-toastify';

function FreelancerProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    experience: '',
    portfolioLink: '',
    hourlyRate: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/freelancers/${user.userId}`);
        setFormData({
          experience: res.data.experience || '',
          portfolioLink: res.data.portfolioLink || '',
          hourlyRate: res.data.hourlyRate || '',
        });
      } catch (err) {
        // No profile yet is fine — leave the form blank for first-time setup
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/freelancers/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">My Freelancer Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Experience</label>
          <input
            type="text"
            name="experience"
            className="form-control"
            placeholder="e.g. 2 years"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Portfolio Link</label>
          <input
            type="text"
            name="portfolioLink"
            className="form-control"
            value={formData.portfolioLink}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Hourly Rate (₹)</label>
          <input
            type="number"
            name="hourlyRate"
            className="form-control"
            value={formData.hourlyRate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

export default FreelancerProfile;