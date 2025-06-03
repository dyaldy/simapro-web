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

  const formatDateTime = (input) => {
    const date = new Date(input);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId || !productId || !amount || !status || !billedDate) {
      alert("Mohon lengkapi semua inputan.");
      return;
    }

    let finalPaidDate = "1970-01-01 00:00:00";
    if (status === "P") {
      if (!paidDate) {
        alert("Tanggal Pembayaran harus diisi jika status Lunas.");
        return;
      }
      finalPaidDate = formatDateTime(paidDate);
    }

    const invoice = [{
      customerId,
      productId,
      amount: amount.toString(),
      status: status.toUpperCase(),
      billedDate: formatDateTime(billedDate),
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
            type="datetime-local"
            value={billedDate}
            onChange={(e) => setBilledDate(e.target.value)}
            required
          />

          <label>Tanggal Pembayaran :</label>
          <input
            type="datetime-local"
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
