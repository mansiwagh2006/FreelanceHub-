import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">FreelanceHub</Link>
      <div className="ms-auto d-flex align-items-center gap-3">
        {user ? (
          <>
            {user.role === 'freelancer' && (
              <>
                <Link className="text-white text-decoration-none" to="/my-applications">
                  My Applications
                </Link>
                <Link className="text-white text-decoration-none" to="/my-profile">
                  My Profile
                </Link>
              </>
            )}
            <span className="text-white">Hi, {user.name} ({user.role})</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
            <Link className="btn btn-light btn-sm" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;