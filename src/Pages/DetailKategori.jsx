import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './DetailKategori.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DetailKategori = () => {
  const [kategoriList, setKategoriList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKategori, setNewKategori] = useState({ name: '', description: '' });
  const [editKategoriId, setEditKategoriId] = useState(null);
  const [editKategoriData, setEditKategoriData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = localStorage.getItem('token');

  const fetchKategori = useCallback(async (page = 1) => {
    setFetching(true);
    try {
      const res = await axios.get(`https://sazura.xyz/api/v1/categories?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKategoriList(res.data.data || []);
      setTotalPages(res.data.meta?.last_page || 1);
      setTotalItems(res.data.meta?.total || 0);
    } catch {
      setMessage({ type: 'error', text: 'Gagal mengambil data kategori' });
    } finally {
      setFetching(false);
    }
  }, [token]);

  useEffect(() => {
    fetchKategori(currentPage);
  }, [fetchKategori, currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewKategori(prev => ({ ...prev, [name]: value }));
  };

  const handleAddKategori = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!newKategori.name.trim()) {
      setMessage({ type: 'error', text: 'Nama kategori wajib diisi' });
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://sazura.xyz/api/v1/categories', newKategori, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Kategori berhasil ditambahkan!' });
      setShowAddForm(false);
      setNewKategori({ name: '', description: '' });
      fetchKategori(currentPage);
    } catch (error) {
      setMessage({ type: 'error', text: `Gagal menambahkan kategori: ${error.response?.data?.message || error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name, id) => {
    if (!window.confirm(`Yakin ingin menghapus kategori "${name}"?`)) return;
    try {
      await axios.delete(`https://sazura.xyz/api/v1/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Kategori berhasil dihapus' });
      fetchKategori(currentPage);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menghapus kategori' });
    }
  };

  const handleEdit = (kategori) => {
    setEditKategoriId(kategori.id);
    setEditKategoriData({ name: kategori.name, description: kategori.description });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditKategoriData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateKategori = async (id) => {
    try {
      await axios.put(`https://sazura.xyz/api/v1/categories/${id}`, editKategoriData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Kategori berhasil diperbarui' });
      setEditKategoriId(null);
      fetchKategori(currentPage);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal mengupdate kategori' });
    }
  };

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='container'>
      <div className="header-section">
        <h1>DETAIL KATEGORI</h1>
        <button className="btn-add" onClick={() => {
          setShowAddForm(prev => !prev);
          setMessage(null);
        }}>
          {showAddForm ? 'Batal' : '+ Tambah Kategori'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {showAddForm && (
        <div className="add-kategori-form">
          <h2>Tambah Kategori Baru</h2>
          <form onSubmit={handleAddKategori}>
            <div className="form-group">
              <label>Nama Kategori:</label>
              <input type="text" name="name" value={newKategori.name} onChange={handleInputChange} required autoFocus />
            </div>
            <div className="form-group">
              <label>Deskripsi:</label>
              <textarea name="description" value={newKategori.description} onChange={handleInputChange} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="kategori-table-wrapper">
        {fetching ? (
          <p>Loading kategori...</p>
        ) : kategoriList.length > 0 ? (
          <>
            <p>Total Kategori: {totalItems}</p>
            <table className="kategori-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Kategori</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kategoriList.map((kategori) => (
                  <tr key={kategori.id}>
                    <td>{kategori.id}</td>
                    <td>
                      {editKategoriId === kategori.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editKategoriData.name}
                          onChange={handleEditInputChange}
                        />
                      ) : kategori.name}
                    </td>
                    <td>
                      {editKategoriId === kategori.id ? (
                        <input
                          type="text"
                          name="description"
                          value={editKategoriData.description || ''}
                          onChange={handleEditInputChange}
                        />
                      ) : kategori.description || '-'}
                    </td>
                    <td>
                      {editKategoriId === kategori.id ? (
                        <>
                          <button onClick={() => handleUpdateKategori(kategori.id)} className="btn-icon">Simpan</button>
                          <button onClick={() => setEditKategoriId(null)} className="btn-icon">Batal</button>
                        </>
                      ) : (
                        <>
                          <FaEdit
                            className="icon edit"
                            onClick={() => handleEdit(kategori)}
                            title="Edit Kategori"
                            style={{ marginRight: "10px", cursor: 'pointer' }}
                          />
                          <FaTrash
                            className="icon delete"
                            onClick={() => handleDelete(kategori.name, kategori.id)}
                            title="Hapus Kategori"
                            style={{ cursor: 'pointer' }}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => goToPage(page)} className={`pagination-button ${currentPage === page ? 'active' : ''}`}>
                  {page}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p>Tidak ada kategori.</p>
        )}
      </div>
    </div>
  );
};

export default DetailKategori;
