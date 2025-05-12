import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProduk.css';

const EditPelanggan = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman

    // Lakukan proses simpan data di sini, misalnya API call

    alert('Produk berhasil disimpan!');
    navigate('/data-pelanggan');
  };

  return (
    <div className="form-container">
      <h1>TAMBAH PELANGGAN</h1>
      <form onSubmit={handleSubmit}>
        <label>Nama Pelanggan :</label>
        <input type="text" placeholder="Masukan Nama Pelanggan..." />

        <label>Email Pelanggan :</label>
        <input type="text" placeholder="Masukan Email Pelanggan..." />

        <div className="form-row">
        <div className="form-group">
          <label>Tipe Pelanggan:</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="tipe" value="bisnis" />
              Bisnis
            </label>
            <label>
              <input type="radio" name="tipe" value="individu" />
              Individu
            </label>
          </div>
          </div>
    
            <div className="form-group">
              <label>Alamat Pelanggan:</label>
              <textarea placeholder="Masukan Alamat"></textarea>
            </div>
          </div>

        <label>Kota Pelanggan :</label>
        <input type="text" placeholder="Masukan Kota Pelanggan..." />

        <label>Kode Pos Pelanggan :</label>
        <input type="text" placeholder="Masukan Kode Pos Pelanggan..." />

        <div className="button-group">
          <button type="submit" className="btn simpan">Simpan</button>
          <button type="button" className="btn batal" onClick={() => navigate("/data-pelanggan")}>Batal</button>
        </div>
      </form>
    </div>
  );
};

export default EditPelanggan;
