import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TambahProduk.css";

const TambahProduk = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    amount: "",
    price: "",
    status: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);

  // Ambil token dari localStorage
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    // Fetch kategori dari API dengan Authorization header
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://sazura.xyz/api/v1/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };

    fetchCategories();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.amount || !form.price || !form.status || !form.categoryId) {
      alert("Mohon lengkapi semua data produk.");
      return;
    }

    try {
      const productData = {
        categoryId: form.categoryId,
        name: form.name,
        amount: form.amount,
        price: form.price,
        status: form.status,
      };

      await axios.post(
        "https://sazura.xyz/api/v1/products/bulk",
        [productData],
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Produk berhasil disimpan!");
      navigate("/data-produk");
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      if (error.response?.data?.message) {
        alert(`Gagal: ${error.response.data.message}`);
      } else {
        alert("Gagal menyimpan produk.");
      }
    }
  };

  return (
    <div className="form-container">
      <h1>TAMBAH PRODUK</h1>
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
        <select name="status" value={form.status} onChange={handleChange} required>
          <option value="">-- Pilih Status --</option>
          <option value="a">Aktif</option>
          <option value="n">Nonaktif</option>
        </select>

        <label>Kategori :</label>
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="button-group">
          <button type="submit" className="btn simpan">
            Simpan
          </button>
          <button
            type="button"
            className="btn batal"
            onClick={() => navigate("/data-produk")}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahProduk;
