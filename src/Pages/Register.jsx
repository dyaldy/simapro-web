import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import './Login.css';
import simaproLogo from '../Logo/simapro3.png';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    setApiError('');

    if (!name) validationErrors.name = 'Nama tidak boleh kosong';
    if (!email) validationErrors.email = 'Email tidak boleh kosong';
    if (!password) validationErrors.password = 'Password tidak boleh kosong';
    if (password !== passwordConfirmation) validationErrors.passwordConfirmation = 'Konfirmasi password tidak cocok';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('https://sazura.xyz/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Simpan token ke localStorage (ubah jika token ada di data.data.token)
        localStorage.setItem('token', data.token);

        alert('Registrasi berhasil! Silakan login.');
        navigate('/');
      } else {
        setApiError(data.message || 'Terjadi kesalahan saat registrasi.');
      }
    } catch (error) {
      setApiError('Gagal terhubung ke server.');
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
        <h2>REGISTER</h2>
        <form onSubmit={handleRegister}>
          <label>Nama:</label>
          <input
            type="text"
            placeholder="Masukkan Nama…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}

          <label>Email:</label>
          <input
            type="email"
            placeholder="Masukkan Email…"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}

          <label>Password:</label>
          <input
            type="password"
            placeholder="Masukkan Password…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}

          <label>Konfirmasi Password:</label>
          <input
            type="password"
            placeholder="Konfirmasi Password…"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          {errors.passwordConfirmation && (
            <div className="error-message">{errors.passwordConfirmation}</div>
          )}

          {apiError && <div className="error-message">{apiError}</div>}

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
