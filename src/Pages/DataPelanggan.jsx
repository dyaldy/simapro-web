import "./DetailKategori.css"; 
import { FaEdit, FaPlusSquare, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DataPelanggan = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // ✅ Ganti ke 15 per halaman

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("https://sazura.xyz/api/v1/customers", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            setData(json.data || []);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            setLoading(false);
        });
    }, [token]);

    const handleDelete = (name, id) => {
        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus pelanggan "${name}"?`);
        if (confirmDelete) {
            fetch(`https://sazura.xyz/api/v1/customers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })
            .then((response) => {
                if (!response.ok) throw new Error("Gagal menghapus pelanggan");
                setData(prevData => prevData.filter(item => item.id !== id));
                alert("Pelanggan berhasil dihapus!");
            })
            .catch((error) => {
                console.error("Error saat menghapus:", error);
                alert("Terjadi kesalahan saat menghapus pelanggan");
            });
        }
    };

    const filteredData = data
        .filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const goToPage = (page) => setCurrentPage(page);

    if (loading) return <p>Loading data...</p>;

    return (
        <div className='container'>
            <h1>DATA PELANGGAN</h1>

            <div className="top-bar">
                <input 
                    type="text" 
                    placeholder="Cari Pelanggan..." 
                    className="search-input" 
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset ke halaman 1 saat mencari
                    }}
                />
                <FaPlusSquare 
                    className="icon plus-icon"
                    onClick={() => navigate("/tambah-pelanggan")}
                />
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nomor</th>
                        <th>Nama</th>
                        <th>Tipe</th>
                        <th>Email</th>
                        <th>Alamat</th>
                        <th>Kota</th>
                        <th>Kode Pos</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={item.id}>
                            <td>{indexOfFirstItem + index + 1}</td> {/* ✅ Nomor urut global */}
                            <td>{item.name}</td>
                            <td className={item.type === 'I' ? 'type-individu' : item.type === 'B' ? 'type-business' : ''}>
                                {item.type === 'B' ? 'Business' : item.type === 'I' ? 'Individu' : item.type}
                            </td>
                            <td>{item.email}</td>
                            <td>{item.address}</td>
                            <td>{item.city}</td>
                            <td>{item.postalCode}</td>
                            <td>
                                <FaEdit 
                                    className="icon edit"
                                    onClick={() => navigate(`/edit-pelanggan/${item.id}`)}
                                />
                                <FaTrash 
                                    className="icon delete"
                                    onClick={() => handleDelete(item.name, item.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Info halaman dan total data */}
            <p className="info-halaman">
                Halaman {currentPage} dari {totalPages} | Total data: {filteredData.length}
            </p>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DataPelanggan;
