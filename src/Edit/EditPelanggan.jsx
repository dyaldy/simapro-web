import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditProduk'; // Gunakan CSS yang sama

const EditPelanggan = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    type: 'I',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil token Bearer, contoh dari localStorage
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    axios.get(`https://sazura.xyz/api/v1/customers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        const pelanggan = res.data.data;
        setForm({
          name: pelanggan.name || '',
          type: pelanggan.type || 'I',
          email: pelanggan.email || '',
          address: pelanggan.address || '',
          city: pelanggan.city || '',
          postalCode: pelanggan.postalCode || ''
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat data pelanggan:", err);
        alert("Gagal memuat data pelanggan.");
        navigate("/data-pelanggan");
      });
  }, [id, navigate, token]);

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
      await axios.put(`https://sazura.xyz/api/v1/customers/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Pelanggan berhasil diperbarui!');
      navigate('/data-pelanggan');
    } catch (error) {
      console.error("Gagal memperbarui pelanggan:", error);
      if (error.response?.data?.message) {
        setError(`Gagal: ${error.response.data.message}`);
      } else {
        setError('Gagal memperbarui pelanggan.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Memuat data pelanggan...</p>;

  return (
    <div className="form-container">
      <h1>EDIT PELANGGAN</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Form input sesuai kode asli */}
        {/* ... (isi form tetap sama seperti sebelumnya) */}
        
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

export default EditPelanggan;
