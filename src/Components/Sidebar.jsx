import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './Sidebar.css';
import simaproLogo from '../Logo/simapro2.png';
import { useUser } from '../context/UserContext'; // Import context

const Sidebar = () => {
  const { user } = useUser(); // Ambil user dari context

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
