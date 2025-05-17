import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TambahProduk.css";

const TambahPenjualan = () => {
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [billedDate, setBilledDate] = useState("");
  const [paidDate, setPaidDate] = useState("");

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("https://sazura.xyz/api/v1/customers");
        if (!res.ok) throw new Error("Gagal mengambil data pelanggan");
        const json = await res.json();
        setCustomers(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Validasi format tanggal: YYYY-MM-DD HH:mm:ss
  const isValidDateTime = (str) => {
    return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId || !amount || !status || !billedDate) {
      alert("Mohon lengkapi semua inputan.");
      return;
    }

    if (!isValidDateTime(billedDate)) {
      alert("Format Tanggal Tagihan salah. Gunakan format: YYYY-MM-DD HH:mm:ss");
      return;
    }

    if (status === "P") {
      if (!paidDate || !isValidDateTime(paidDate)) {
        alert("Tanggal Pembayaran harus diisi dan format harus benar jika status Lunas.");
        return;
      }
    }

    const newInvoice = [
      {
        customerId,
        amount: Number(amount),
        status,
        billedDate,
        paidDate: status === "P" ? paidDate : null,
      },
    ];

    console.log("Kirim data invoice:", newInvoice);

    try {
      const res = await fetch("https://sazura.xyz/api/v1/invoices/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gagal mengirim data: ${errText}`);
      }

      alert("Invoice berhasil dibuat dan dikirim ke server");
      navigate("/detail-penjualan");
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim data: " + err.message);
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
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          >
            <option value="">-- Pilih Pelanggan --</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.id.toString().padStart(3, "0")} - {cust.name}
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
            <button type="submit" className="btn simpan">
              Simpan
            </button>
            <button
              type="button"
              className="btn batal"
              onClick={() => navigate("/detail-penjualan")}
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TambahPenjualan;
