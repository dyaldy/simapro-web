import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditProduk.css'; // Gunakan style yang sama

const EditProduk = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: '',
    amount: '',
    price: '',
    status: '',
    categoryId: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://sazura.xyz/api/v1/products/${id}`)
      .then((res) => {
        const produk = res.data.data;
        setForm({
          name: produk.name || '',
          amount: produk.amount || '',
          price: produk.price || '',
          status: produk.status || '',
          categoryId: produk.categoryId || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat produk:", err);
        alert("Gagal memuat data produk.");
        navigate("/data-produk");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.amount || !form.price || !form.status || !form.categoryId) {
      alert('Mohon lengkapi semua data produk.');
      return;
    }

    try {
      const updatedData = {
        name: form.name,
        amount: form.amount,
        price: form.price,
        status: form.status,
        categoryId: form.categoryId
      };

      await axios.put(`https://sazura.xyz/api/v1/products/${id}`, updatedData);
      alert('Produk berhasil diperbarui!');
      navigate('/data-produk');
    } catch (error) {
      console.error("Gagal memperbarui produk:", error);
      if (error.response?.data?.message) {
        alert(`Gagal: ${error.response.data.message}`);
      } else {
        alert('Gagal memperbarui produk.');
      }
    }
  };

  if (loading) return <p>Memuat data produk...</p>;

  return (
    <div className="form-container">
      <h1>EDIT PRODUK</h1>
      <form onSubmit={handleSubmit}>
        <label>Nama Produk :</label>
        <input
          type="text"
          name="name"
          placeholder="Masukkan Nama Produk..."
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Stok :</label>
        <input
          type="number"
          name="amount"
          placeholder="Masukkan Jumlah Stok..."
          value={form.amount}
          onChange={handleChange}
          required
        />

        <label>Harga :</label>
        <input
          type="number"
          name="price"
          placeholder="Masukkan Harga..."
          value={form.price}
          onChange={handleChange}
          required
        />

        <label>Status :</label>
        <input
          type="text"
          name="status"
          placeholder="Masukkan Status..."
          value={form.status}
          onChange={handleChange}
          required
        />

        <label>ID Kategori :</label>
        <input
          type="text"
          name="categoryId"
          placeholder="Masukkan ID Kategori..."
          value={form.categoryId}
          onChange={handleChange}
          required
        />

        <div className="button-group">
          <button type="submit" className="btn simpan">Simpan</button>
          <button type="button" className="btn batal" onClick={() => navigate("/data-produk")}>Batal</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduk;
