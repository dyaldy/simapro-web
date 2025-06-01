import React, { useState } from "react";
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

  const token = localStorage.getItem("token") || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.amount || !form.price || !form.status || !form.categoryId) {
      alert("Mohon lengkapi semua data produk.");
      return;
    }

    const productData = {
      categoryId: parseInt(form.categoryId, 10),
      name: form.name,
      amount: parseFloat(form.amount),
      price: parseFloat(form.price),
      status: form.status,
    };

    try {
      await axios.post(
        "https://sazura.xyz/api/v1/products/bulk",
        [productData],
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      alert("Produk berhasil disimpan!");
      navigate("/data-produk");
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert(`Gagal: ${error.response?.data?.message || "Terjadi kesalahan."}`);
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
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="">-- Pilih Status --</option>
          <option value="a">Aktif</option>
          <option value="n">Nonaktif</option>
        </select>

        <label>ID Kategori :</label>
        <input
          type="number"
          name="categoryId"
          placeholder="Masukkan ID Kategori..."
          value={form.categoryId}
          onChange={handleChange}
          required
        />

        <div className="button-group">
          <button type="submit" className="btn simpan">Simpan</button>
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
