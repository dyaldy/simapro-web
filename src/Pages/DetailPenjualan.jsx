import React, { useEffect, useState, useCallback } from 'react';
import "./DataProduk.css";
import { FaPlusSquare, FaTrash, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DetailPenjualan = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const token = localStorage.getItem('token') || '';

    const fetchInvoices = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('https://sazura.xyz/api/v1/invoices', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const result = await response.json();
            setData(result.data || []);
        } catch (error) {
            console.error("Gagal mengambil data invoice:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchCustomers = useCallback(async () => {
        try {
            const response = await fetch('https://sazura.xyz/api/v1/customers', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const result = await response.json();
            setCustomers(result.data || []);
        } catch (error) {
            console.error("Gagal mengambil data pelanggan:", error);
        }
    }, [token]);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch('https://sazura.xyz/api/v1/products', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            const result = await response.json();
            setProducts(result.data || []);
        } catch (error) {
            console.error("Gagal mengambil data produk:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchInvoices();
        fetchCustomers();
        fetchProducts();
    }, [fetchInvoices, fetchCustomers, fetchProducts]);

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
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

    const getCustomerName = (customerId) => {
        const customer = customers.find(c => Number(c.id) === Number(customerId));
        return customer ? customer.name : 'Tidak Diketahui';
    };

    const getProductName = (productId) => {
        const product = products.find(p => Number(p.id) === Number(productId));
        return product ? product.name : 'Tidak Diketahui';
    };

    const filteredData = data
        .filter(item =>
            getCustomerName(item.customerId).toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const nameA = getCustomerName(a.customerId).toLowerCase();
            const nameB = getCustomerName(b.customerId).toLowerCase();
            return nameA.localeCompare(nameB);
        });

    const exportToExcel = () => {
        const exportData = filteredData.map((item, index) => ({
            No: index + 1,
            "Nama Pelanggan": getCustomerName(item.customerId),
            "Produk": getProductName(item.productId),
            Jumlah: item.amount,
            Status: item.status === 'B' ? 'Belum Lunas' : 'Lunas',
            "Tanggal Tagihan": item.billedDate,
            "Tanggal Pembayaran": item.paidDate || '-',
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Invoice");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "Data_Invoice.xlsx");
    };

    return (
        <div className='container'>
            <h1>INVOICE</h1>

            <div className="top-bar">
                <input
                    type="text"
                    placeholder="Cari Nama Pelanggan..."
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <FaPlusSquare
                    className="icon plus-icon"
                    onClick={() => navigate("/tambah-penjualan")}
                    title="Tambah Penjualan"
                />
                <button className="download-btn" onClick={exportToExcel}>
                    Unduh Invoice
                </button>
            </div>

            {loading ? (
                <p>Loading data...</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>NOMOR</th>
                            <th>NAMA PELANGGAN</th>
                            <th>PRODUK</th>
                            <th>JUMLAH</th>
                            <th>STATUS</th>
                            <th>TANGGAL TAGIHAN</th>
                            <th>TANGGAL PEMBAYARAN</th>
                            <th>HAPUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={item.id || index}>
                                <td>{index + 1}</td>
                                <td>{getCustomerName(item.customerId)}</td>
                                <td>{getProductName(item.productId)}</td>
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
