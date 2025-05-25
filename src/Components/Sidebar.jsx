import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './Sidebar.css';
import simaproLogo from '../Logo/simapro2.png';

const Sidebar = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    image: '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser({
        name: userData.name || '',
        email: userData.email || '',
        image: userData.image || 'https://via.placeholder.com/80', // fallback image
      });
    }
  }, []);

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">
          <img src={simaproLogo} alt="Simapro Logo" />
        </div>
        <NavLink to="/profile" className="admin-box">
          <img src={user.image} alt="Admin" />
          <div className="admin-info">
            <span className="admin-role">ADMIN</span>
            <span className="admin-email">{user.name}</span>
            <span className="admin-email">{user.email}</span>
          </div>
        </NavLink>

        <div className="sidebar-menu">
          <ul>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink to="/data-produk">Data Produk</NavLink></li>
            <li><NavLink to="/detail-kategori">Detail Kategori</NavLink></li>
            <li><NavLink to="/data-pelanggan">Data Pelanggan</NavLink></li>
            <li><NavLink to="/detail-penjualan">Detail Penjualan</NavLink></li>
          </ul>
        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
