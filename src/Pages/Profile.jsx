import React, { useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('Aldy');
  const [email, setEmail] = useState('Aldy@gmail.com');
  const [image, setImage] = useState('img.jpg');
  const navigate = useNavigate();
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
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
          <span className="file-name">img.jpg</span>
        </div>
      </div>

      <div className="form-group">
        <label>Nama :</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="button-group">
        <button className="logout-button"
        onClick={() => navigate("/")}
        >LogOut</button>
        <button className="save-button">simpan</button>
      </div>
    </div>
  );
};

export default Profile;
