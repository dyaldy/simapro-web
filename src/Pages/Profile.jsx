import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">PROFILE</h2>
      <div className="profile-image-section">
      </div>

      <div className="form-group">
        <label>Nama :</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="button-group">
        <button className="logout-button" onClick={handleLogout}>
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Profile;
