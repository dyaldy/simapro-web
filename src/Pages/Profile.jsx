import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setName(user.name || '');
      setEmail(user.email || '');
      setImage(user.image || 'https://via.placeholder.com/150'); // fallback image jika user.image kosong
    }
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newImage = URL.createObjectURL(e.target.files[0]);
      setImage(newImage);
    }
  };

  const handleSave = () => {
    // Update user di localStorage juga
    const userStr = localStorage.getItem('user');
    let user = {};
    if (userStr) {
      user = JSON.parse(userStr);
    }
    const updatedUser = { ...user, name, email, image };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('Profil berhasil disimpan!');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">PROFILE</h2>
      <div className="profile-image-section">
        <img src={image} alt="Profile" className="profile-image" />
        <div className="upload-section">
          <label className="custom-file-upload">
            <input type="file" onChange={handleImageChange} />
            Choose File
          </label>
        </div>
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
        <button className="save-button" onClick={handleSave}>
          Simpan
        </button>
      </div>
    </div>
  );
};

export default Profile;
