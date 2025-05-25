import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import simaproLogo from '../Logo/simapro3.png';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: type === 'success' ? '#4BB543' : '#FF5252',
        color: 'white',
        padding: '10px 20px',
        borderRadius: 5,
        zIndex: 9999,
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        fontWeight: 'bold',
        minWidth: '250px',
        textAlign: 'center',
      }}
    >
      {message}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleLogin = async () => {
    if (!email || !password) {
      setNotification({
        show: true,
        message: 'Email dan password harus diisi!',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      const loginResponse = await fetch('https://sazura.xyz/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok || !loginData.access_token) {
        throw new Error(loginData.message || 'Login gagal');
      }

      const token = loginData.access_token;
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');

      const userResponse = await fetch('https://sazura.xyz/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(userData.message || 'Gagal mengambil data user');
      }

      localStorage.setItem('user', JSON.stringify(userData));

      setNotification({
        show: true,
        message: 'Login berhasil!',
        type: 'success',
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setNotification({
        show: true,
        message: error.message || 'Email atau password salah!',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <div className="login-left">
        <div className="logo">
          <img src={simaproLogo} alt="Simapro Logo" />
        </div>
      </div>

      <div className="login-right">
        <h2>SIMAPRO</h2>
        <p>Sistem Manajemen Penjualan Produk</p>

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
            onClick={() => navigate('/register')}
          >
            Belum punya akun? Daftar
          </span>
        </div>

        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Memproses...' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
