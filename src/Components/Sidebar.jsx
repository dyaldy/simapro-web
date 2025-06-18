import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './Sidebar.css';
import simaproLogo from '../Logo/simapro2.png';

const Sidebar = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser({
        name: userData.name || '',
        email: userData.email || '',
      });
    }

    const handleClickOutside = (e) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="app-container">
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        &#9776;
      </button>

      <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo">
          <img src={simaproLogo} alt="Simapro Logo" />
        </div>

        <NavLink to="/profile" className="admin-box" onClick={() => setIsOpen(false)}>
          <div className="admin-info">
            <span className="admin-role">ADMIN</span>
            <span className="admin-email">{user.name}</span>
            <span className="admin-email">{user.email}</span>
          </div>
        </NavLink>

        <div className="sidebar-menu">
          <ul>
            <li><NavLink to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</NavLink></li>
            <li><NavLink to="/data-produk" onClick={() => setIsOpen(false)}>Data Produk</NavLink></li>
            <li><NavLink to="/detail-kategori" onClick={() => setIsOpen(false)}>Detail Kategori</NavLink></li>
            <li><NavLink to="/data-pelanggan" onClick={() => setIsOpen(false)}>Data Pelanggan</NavLink></li>
            <li><NavLink to="/detail-penjualan" onClick={() => setIsOpen(false)}>Detail Penjualan</NavLink></li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
