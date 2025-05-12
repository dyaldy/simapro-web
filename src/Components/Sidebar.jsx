import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './Sidebar.css';
import simaproLogo from '../Logo/simapro2.png';
import admin from '../Logo/image.png';

const Sidebar = () => {
  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">
                <img src={simaproLogo} alt="Simapro Logo" />
        </div>
        <NavLink to="/profile" className="admin-box">
          <img src={admin} alt="Admin" />
          <div className="admin-info">
            <span className="admin-role">ADMIN</span>
            <span className="admin-email">aldyismrn</span>
          </div>
        </NavLink>

        <div className="sidebar-menu">
          <ul>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/data-produk" className={({ isActive }) => isActive ? 'active' : ''}>
                Data Produk
              </NavLink>
            </li>
            <li>
              <NavLink to="/detail-kategori" className={({ isActive }) => isActive ? 'active' : ''}>
                Detail Kategori
              </NavLink>
            </li>
            <li>
              <NavLink to="/data-pelanggan" className={({ isActive }) => isActive ? 'active' : ''}>
                Data Pelanggan
              </NavLink>
            </li>
            <li>
              <NavLink to="/detail-penjualan" className={({ isActive }) => isActive ? 'active' : ''}>
                Detail Penjualan
              </NavLink>
            </li>
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
