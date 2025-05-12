import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import simaproLogo from '../Logo/simapro3.png';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Belum ada logika autentikasi, langsung pindah halaman
    navigate('/data-produk');
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo">
                <img src={simaproLogo} alt="Simapro Logo" />
        </div>
      </div>
      <div className="login-right">
        <h2>SIMAPRO</h2>
        <p>Sistem Manajemen Penjualan Produk</p>
        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Masukkan Email…"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password:</label>
          <input
            type="password"
            placeholder="Masukkan Password…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="forgot-password">
              <span
                className="forgot-link"
                onClick={() => alert('Fungsi lupa password belum tersedia')}
              >
                Lupa Password?
              </span>
            </div>
          <button type="submit">LogIn</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
