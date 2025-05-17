import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import simaproLogo from '../Logo/simapro3.png';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  // Daftar user yang valid
  const validUsers = [
    { email: 'satria@gmail.com', password: 'satria' },
    { email: 'aldy@gmail.com', password: 'aldy123' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error
    setEmailError('');
    setPasswordError('');
    setAuthError('');

    if (!email) {
      setEmailError('Email tidak boleh kosong');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password tidak boleh kosong');
      isValid = false;
    }

    if (!isValid) return;

    // Cek apakah user valid
    const userMatch = validUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (userMatch) {
      navigate('/dashboard');
    } else {
      setAuthError('Email atau password salah');
    }
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
          {emailError && <div className="error-message">{emailError}</div>}

          <label>Password:</label>
          <input
            type="password"
            placeholder="Masukkan Password…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <div className="error-message">{passwordError}</div>}

          {authError && <div className="error-message">{authError}</div>}

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
