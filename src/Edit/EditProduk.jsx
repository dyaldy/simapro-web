import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProduk.css';

const EditProduk = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    //e.preventDefault(); // Mencegah reload halaman

    // Lakukan proses simpan data di sini, misalnya API call

    alert('Produk berhasil disimpan!');
    navigate('/data-produk');
  };

  return (
    <div className="form-container">
      <h1>EDIT PRODUK</h1>
      <form onSubmit={handleSubmit}>
        <label>Nama Produk :</label>
        <input type="text" placeholder="Masukan Nama Produk..." />

        <label>Stok :</label>
        <input type="number" placeholder="Masukan Jumlah Stok..." />

        <label>Harga :</label>
        <input type="number" placeholder="Masukan Harga..." />

        <label>Deskripsi :</label>
        <textarea placeholder="Masukan Deskripsi"></textarea>

        <div className="button-group">
          <button type="submit" className="btn simpan">Simpan</button>
          <button type="button" className="btn batal" onClick={() => navigate("/data-produk")}>Batal</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduk;
