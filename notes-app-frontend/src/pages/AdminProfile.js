import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
 
  const [usernameForm, setUsernameForm] = useState({
    newUsername: '',
    password: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await adminAPI.getProfile();
      setProfile(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      showMessage('New password must be at least 6 characters', 'error');
      return;
    }

    try {
      await adminAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      showMessage('Password updated successfully!', 'success');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update password', 'error');
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    
    if (usernameForm.newUsername.length < 3) {
      showMessage('Username must be at least 3 characters', 'error');
      return;
    }

    try {
      await adminAPI.changeUsername({
        newUsername: usernameForm.newUsername,
        password: usernameForm.password
      });
      
      showMessage('Username updated successfully!', 'success');
      setUsernameForm({
        newUsername: '',
        password: ''
      });

      fetchProfile();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update username', 'error');
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="empty-state">
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2> Admin Profile</h2>
        <div>
          <button 
            className="edit-btn" 
            onClick={() => navigate('/admin')}
            style={{ marginRight: '10px' }}
          >
            Back to Dashboard
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {message && (
        <div className={`${messageType === 'error' ? 'error-message' : 'success-message'}`}>
          {message}
        </div>
      )}

      <div className="admin-info-box">
        <h3>Admin Account Management</h3>
        <p>Manage your admin account details securely</p>
      </div>

      <div className="search-section">
        <button 
          className={`${activeTab === 'profile' ? 'edit-btn' : 'cancel-btn'}`}
          onClick={() => setActiveTab('profile')}
          style={{ marginRight: '10px' }}
        >
          Profile Info
        </button>
        <button 
          className={`${activeTab === 'password' ? 'edit-btn' : 'cancel-btn'}`}
          onClick={() => setActiveTab('password')}
          style={{ marginRight: '10px' }}
        >
          Change Password
        </button>
        <button 
          className={`${activeTab === 'username' ? 'edit-btn' : 'cancel-btn'}`}
          onClick={() => setActiveTab('username')}
        >
          Change Username
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="note-form">
          <h3>Profile Information</h3>
          <div className="note-meta">
            <p><strong> Username:</strong> {profile?.username}</p>
            <p><strong> Role:</strong> {profile?.role}</p>
            <p><strong> User ID:</strong> {profile?.id}</p>
            <p><strong> Account Created:</strong> {profile?.created_at ? new Date(profile.created_at).toLocaleString() : 'Unknown'}</p>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="note-form">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            <div className="form-row">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            <div className="note-actions">
              <button type="submit">Update Password</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'username' && (
        <div className="note-form">
          <h3>👤 Change Username</h3>
          <form onSubmit={handleUsernameChange}>
            <div className="form-row">
              <input
                type="text"
                placeholder="New Username"
                value={usernameForm.newUsername}
                onChange={(e) => setUsernameForm({ ...usernameForm, newUsername: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="password"
                placeholder="Current Password (for verification)"
                value={usernameForm.password}
                onChange={(e) => setUsernameForm({ ...usernameForm, password: e.target.value })}
                required
              />
            </div>
            <div className="note-actions">
              <button type="submit">Update Username</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProfile; 