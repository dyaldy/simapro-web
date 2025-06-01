import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TambahProduk.css";

const TambahPenjualan = () => {
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [billedDate, setBilledDate] = useState("");
  const [paidDate, setPaidDate] = useState("");

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!token) {
      alert("Anda harus login terlebih dahulu.");
      navigate("/login");
      return;
    }

    const fetchCustomers = async () => {
      try {
        const res = await fetch("https://sazura.xyz/api/v1/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Gagal mengambil data pelanggan");
        const json = await res.json();
        setCustomers(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch("https://sazura.xyz/api/v1/products", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Gagal mengambil data produk");
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCustomers();
    fetchProducts();
  }, [token, navigate]);

  const isValidDateTime = (str) => {
    return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId || !productId || !amount || !status || !billedDate) {
      alert("Mohon lengkapi semua inputan.");
      return;
    }

    if (!isValidDateTime(billedDate)) {
      alert("Format Tanggal Tagihan salah. Gunakan format: YYYY-MM-DD HH:mm:ss");
      return;
    }

    let finalPaidDate = paidDate;
    if (status === "P") {
      if (!paidDate || !isValidDateTime(paidDate)) {
        alert("Tanggal Pembayaran harus diisi dan format harus benar jika status Lunas.");
        return;
      }
    } else {
      finalPaidDate = "1970-01-01 00:00:00";
    }

    const invoice = [{
      customerId,
      productId,
      amount: amount.toString(),
      status: status.toUpperCase(), // "P" atau "B"
      billedDate,
      paidDate: finalPaidDate,
    }];

    try {
      const res = await fetch("https://sazura.xyz/api/v1/invoices/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoice),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Unauthorized: Token tidak valid. Silakan login ulang.");
          navigate("/login");
          return;
        }
        const errText = await res.text();
        throw new Error(`Gagal mengirim data: ${errText}`);
      }

      alert("Invoice berhasil dikirim.");
      navigate("/detail-penjualan");
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    }
  };

  return (
    <div className="form-container">
      <h1>TAMBAH INVOICE</h1>

      {loading && <p>Loading pelanggan...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <form onSubmit={handleSubmit}>
          <label>Pilih Pelanggan :</label>
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
            <option value="">-- Pilih Pelanggan --</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.id.toString().padStart(3, "0")} - {cust.name}
              </option>
            ))}
          </select>

          <label>Pilih Produk :</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
            <option value="">-- Pilih Produk --</option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name}
              </option>
            ))}
          </select>

          <label>Jumlah :</label>
          <input
            type="number"
            placeholder="Masukan Jumlah..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min={1}
          />

          <label>Status :</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="status"
                value="P"
                checked={status === "P"}
                onChange={(e) => setStatus(e.target.value)}
                required
              />
              Lunas
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="B"
                checked={status === "B"}
                onChange={(e) => setStatus(e.target.value)}
              />
              Belum Lunas
            </label>
          </div>

          <label>Tanggal Tagihan :</label>
          <input
            type="text"
            placeholder="YYYY-MM-DD HH:mm:ss"
            value={billedDate}
            onChange={(e) => setBilledDate(e.target.value)}
            required
          />

          <label>Tanggal Pembayaran :</label>
          <input
            type="text"
            placeholder="YYYY-MM-DD HH:mm:ss"
            value={paidDate}
            onChange={(e) => setPaidDate(e.target.value)}
            disabled={status !== "P"}
            required={status === "P"}
          />

          <div className="button-group">
            <button type="submit" className="btn simpan">Simpan</button>
            <button type="button" className="btn batal" onClick={() => navigate("/detail-penjualan")}>
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TambahPenjualan;
