import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TambahProduk.css';

const TambahPenjualan = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman

    // Lakukan proses simpan data di sini, misalnya API call

    alert('Produk berhasil disimpan!');
    navigate('/detail-penjualan');
  };

  return (
    <div className="form-container">
      <h1>TAMBAH INVOICE </h1>
      <form onSubmit={handleSubmit}>
      <label>Pilih Pelanggan :</label>
        <select>
            <option value="">-- Pilih Pelanggan --</option>
            <option value="id">001-Hafizh</option>
            <option value="id">002-Aldy</option>
            <option value="id">003-Satria</option>
        </select>
        <label>Pilih Produk :</label>
        <select>
            <option value="">-- Pilih Produk --</option>
            <option value="id">001-Bimoli</option>
            <option value="id">002-Beras</option>
            <option value="id">003-Jaket</option>
        </select>
        <label>Jumlah :</label>
        <input type="number" placeholder="Masukan Jumlah..." />
        <label>Status :</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="tipe" value="bisnis" />
              Lunas
            </label>
            <label>
              <input type="radio" name="tipe" value="individu" />
              Belum Lunas
            </label>
          </div>

        <div className="button-group">
          <button type="submit" className="btn simpan">Simpan</button>
          <button type="button" className="btn batal" onClick={() => navigate("/detail-penjualan")}>Batal</button>
        </div>
      </form>
    </div>
  );
};

export default TambahPenjualan;
