import "./DataProduk.css";
import { FaEdit, FaPlusSquare, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DataProduk = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("https://sazura.xyz/api/v1/products")
            .then((response) => response.json())
            .then((json) => {
                setData(json.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const handleDelete = (productName, productId) => {
        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`);
        if (confirmDelete) {
            fetch(`https://sazura.xyz/api/v1/products/${productId}`, {
                method: 'DELETE',
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal menghapus produk");
                }
                setData((prevData) => prevData.filter((item) => item.id !== productId));
                alert("Produk berhasil dihapus!");
            })
            .catch((error) => {
                console.error("Error saat menghapus:", error);
                alert("Terjadi kesalahan saat menghapus produk");
            });
        }
    };

    const filteredData = data
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name)); // Urutkan berdasarkan nama

    if (loading) return <p>Loading data...</p>;

    return (
        <div className='container'>
            <h1>DATA PRODUK</h1>

            <div className="top-bar">
                <input 
                    type="text" 
                    placeholder="Cari Produk..." 
                    className="search-input" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaPlusSquare 
                    className="icon plus-icon"
                    onClick={() => navigate("/tambah-produk")}
                />
            </div>

            {filteredData.length === 0 ? (
                <p>Tidak ada data produk yang sesuai</p>
            ) : (
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nomor</th> {/* Ganti dari ID */}
                        <th>Nama Produk</th>
                        <th>Stok</th>
                        <th>Harga</th>
                        <th>Status</th>
                        <th>Kategori ID</th>
                        <th>Edit</th>
                        <th>Hapus</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td> {/* Ganti dari item.id */}
                            <td>{item.name}</td>
                            <td>{item.amount}</td>
                            <td>{item.price ? `Rp ${parseInt(item.price).toLocaleString('id-ID')}` : 'Rp 0'}</td>
                            <td>
                                <span className={item.status === 'a' ? 'status-aktif' : item.status === 'n' ? 'status-nonaktif' : ''}>
                                    {item.status === 'a' ? 'Aktif' : item.status === 'n' ? 'Nonaktif' : item.status || '-'}
                                </span>
                            </td>
                            <td>{item.categoryId || '-'}</td>
                            <td>
                                <FaEdit 
                                    className="icon edit"
                                    onClick={() => navigate(`/edit-produk/${item.id}`)}
                                />
                            </td>
                            <td>
                                <FaTrash 
                                    className="icon delete"
                                    onClick={() => handleDelete(item.name, item.id)}
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

export default DataProduk;
