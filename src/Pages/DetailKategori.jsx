import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import "./DetailKategori.css";

const DetailKategori = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKategori, setNewKategori] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  // Gunakan useCallback supaya fungsi fetchKategori stabil referensinya
  const fetchKategori = useCallback(async () => {
    try {
      const res = await axios.get('https://sazura.xyz/api/v1/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      setKategoriList(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data kategori:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchKategori();
  }, [fetchKategori]);  // sekarang dependency sudah lengkap

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewKategori({
      ...newKategori,
      [name]: value
    });
  };

  const handleAddKategori = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!newKategori.name) {
      alert('Nama kategori wajib diisi');
      setLoading(false);
      return;
    }

    try {
      await axios.post('https://sazura.xyz/api/v1/categories', newKategori, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });
      alert('Kategori berhasil ditambahkan!');
      setShowAddForm(false);
      setNewKategori({ name: '', description: '' });
      fetchKategori();
    } catch (error) {
      console.error("Gagal menambahkan kategori:", error);
      alert(`Gagal menambahkan kategori: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className="header-section">
        <h1>DETAIL KATEGORI</h1>
        
        <button 
          className="btn-add"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Batal' : '+ Tambah Kategori'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-kategori-form">
          <h2>Tambah Kategori Baru</h2>
          <form onSubmit={handleAddKategori}>
            <div className="form-group">
              <label>Nama Kategori:</label>
              <input
                type="text"
                name="name"
                value={newKategori.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama kategori"
                required
              />
            </div>
            <div className="form-group">
              <label>Deskripsi (Opsional):</label>
              <textarea
                name="description"
                value={newKategori.description}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi kategori"
              />
            </div>
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="kategori-list">
        {Array.isArray(kategoriList) && kategoriList.map((kategori) => (
          <div key={kategori.id} className="kategori-item">
            <div className="kategori-name">KATEGORI: {kategori.name}</div>
            <div className="kategori-name">ID: {kategori.category_id}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailKategori;
