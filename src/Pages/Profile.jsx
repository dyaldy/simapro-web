import React, { useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Import context

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser(); // Ambil dan ubah global state

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(user.image);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newImage = URL.createObjectURL(e.target.files[0]);
      setImage(newImage);
    }
  };

  const handleSave = () => {
    setUser({ name, email, image });
    alert('Profil berhasil disimpan!');
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
        <button className="logout-button" onClick={() => navigate("/")}>
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
