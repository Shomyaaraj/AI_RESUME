import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-icon">AI</div>
          <span className="brand-text">Interview<span>AI</span></span>
        </Link>

        {user && (
          <div className="user-menu">
            <div className="user-info">
              <span className="avatar">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </span>
              <span>{user.username}</span>
            </div>
            <button onClick={onLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
