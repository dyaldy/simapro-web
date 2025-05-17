import React, { useEffect, useState } from 'react';
import "./DataProduk.css";
import { FaPlusSquare, FaTrash, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DetailPenjualan = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://sazura.xyz/api/v1/invoices');
            const result = await response.json();
            setData(result.data);
        } catch (error) {
            console.error("Gagal mengambil data invoice:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (item) => {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

        const updatedInvoice = {
            ...item,
            status: 'P',
            paidDate: formattedDate,
        };

        try {
            const response = await fetch(`https://sazura.xyz/api/v1/invoices/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedInvoice)
            });

            if (!response.ok) {
                throw new Error("Gagal menyimpan perubahan ke server.");
            }

            setData(prevData =>
                prevData.map(d => (d.id === item.id ? { ...d, status: 'P', paidDate: formattedDate } : d))
            );
        } catch (error) {
            alert("Gagal menyimpan perubahan ke server.");
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        const konfirmasi = window.confirm("Yakin ingin menghapus invoice ini?");
        if (!konfirmasi) return;

        try {
            const response = await fetch(`https://sazura.xyz/api/v1/invoices/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Gagal menghapus invoice.");
            }

            setData(prevData => prevData.filter(item => item.id !== id));
        } catch (error) {
            alert("Gagal menghapus invoice.");
            console.error(error);
        }
    };

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
                            <th>ID PELANGGAN</th>
                            <th>JUMLAH</th>
                            <th>STATUS</th>
                            <th>TANGGAL TAGIHAN</th>
                            <th>TANGGAL PEMBAYARAN</th>
                            <th>HAPUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.map((item, index) => (
                            <tr key={item.id || index}>
                                <td>{index + 1}</td>
                                <td>{item.customerId}</td>
                                <td>{item.amount}</td>
                                <td>
                                    {item.status === 'B' ? (
                                        <label style={{ color: 'red', fontWeight: 'bold' }}>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleStatusChange(item)}
                                                style={{ marginRight: '5px' }}
                                            />
                                            Belum Lunas
                                        </label>
                                    ) : (
                                        <span style={{ color: 'green', fontWeight: 'bold' }}>
                                            <FaCheck style={{ marginRight: '5px' }} />
                                            Lunas
                                        </span>
                                    )}
                                </td>
                                <td>{item.billedDate}</td>
                                <td>{item.paidDate || '-'}</td>
                                <td>
                                    <FaTrash
                                        className="icon delete"
                                        onClick={() => handleDelete(item.id)}
                                        title="Hapus invoice"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DetailPenjualan;
