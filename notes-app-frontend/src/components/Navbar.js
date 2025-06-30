import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      {isLoggedIn ? (
        <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: 10 }}>Login</Link>
          <Link to="/register" style={{ marginLeft: 10 }}>Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
