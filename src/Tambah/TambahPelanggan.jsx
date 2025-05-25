import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TambahProduk.css';

const TambahPelanggan = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    type: 'I', // Default to 'I' (Individu)
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ambil token Bearer dari localStorage
  const token = localStorage.getItem('token') || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!form.name || !form.email || !form.address || !form.city || !form.postalCode) {
      setError('Mohon lengkapi semua data pelanggan.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('https://sazura.xyz/api/v1/customers', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Pelanggan berhasil ditambahkan!');
      navigate('/data-pelanggan');
    } catch (error) {
      console.error("Gagal menambahkan pelanggan:", error);
      if (error.response?.data?.message) {
        setError(`Gagal: ${error.response.data.message}`);
      } else {
        setError('Gagal menambahkan pelanggan.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>TAMBAH PELANGGAN</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Nama Pelanggan :</label>
        <input 
          type="text" 
          name="name"
          placeholder="Masukan Nama Pelanggan..." 
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email Pelanggan :</label>
        <input 
          type="email" 
          name="email"
          placeholder="Masukan Email Pelanggan..." 
          value={form.email}
          onChange={handleChange}
          required
        />

        <div className="form-row">
          <div className="form-group">
            <label>Tipe Pelanggan:</label>
            <div className="radio-group">
              <label>
                <input 
                  type="radio" 
                  name="type" 
                  value="B" 
                  checked={form.type === 'B'}
                  onChange={handleChange}
                />
                Bisnis (B)
              </label>
              <label>
                <input 
                  type="radio" 
                  name="type" 
                  value="I" 
                  checked={form.type === 'I'}
                  onChange={handleChange}
                />
                Individu (I)
              </label>
            </div>
          </div>
    
          <div className="form-group">
            <label>Alamat Pelanggan:</label>
            <textarea 
              name="address"
              placeholder="Masukan Alamat"
              value={form.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>

        <label>Kota Pelanggan :</label>
        <input 
          type="text" 
          name="city"
          placeholder="Masukan Kota Pelanggan..." 
          value={form.city}
          onChange={handleChange}
          required
        />

        <label>Kode Pos Pelanggan :</label>
        <input 
          type="text" 
          name="postalCode"
          placeholder="Masukan Kode Pos Pelanggan..." 
          value={form.postalCode}
          onChange={handleChange}
          required
        />

        <div className="button-group">
          <button type="submit" className="btn simpan" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button 
            type="button" 
            className="btn batal" 
            onClick={() => navigate("/data-pelanggan")}
            disabled={isLoading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahPelanggan;
