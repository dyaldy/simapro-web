import React, { useEffect, useState } from 'react';
import "./DataProduk.css";
import { FaPlusSquare, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DetailPenjualan = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch('https://sazura.xyz/api/v1/invoices');
                const result = await response.json();
                setData(result.data); // Pastikan sesuai struktur dari API
            } catch (error) {
                console.error("Gagal mengambil data invoice:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    return (
        <div className='container'>
            <h1>INVOICE</h1>

            <div className="top-bar">
                <input 
                    type="text" 
                    placeholder="Ketikkan Produk..." 
                    className="search-input" 
                />
                <FaPlusSquare 
                    className="icon plus-icon"
                    onClick={() => navigate("/tambah-penjualan")}
                />
            </div>

            {loading ? (
                <p>Loading data...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Pelanggan</th>
                            <th>Jumlah</th>
                            <th>Status</th>
                            <th>Tanggal Tagihan</th>
                            <th>Tanggal Pembayaran</th>
                            <th>Hapus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.customerId}</td>
                                <td>{item.amount}</td>
                                <td>{item.status}</td>
                                <td>{item.billedDate}</td>
                                <td>{item.paidDate}</td>
                                <td><FaTrash className="icon delete" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DetailPenjualan;
