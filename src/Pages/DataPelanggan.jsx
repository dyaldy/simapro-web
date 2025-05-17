// DataPelanggan.jsx
import "./DetailKategori.css";
import { FaEdit, FaPlusSquare, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DataPelanggan = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("https://sazura.xyz/api/v1/customers")
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

    const handleDelete = (name, id) => {
        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus pelanggan "${name}"?`);
        if (confirmDelete) {
            fetch(`https://sazura.xyz/api/v1/customers/${id}`, {
                method: 'DELETE',
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Gagal menghapus pelanggan");
                }
                setData((prevData) => prevData.filter((item) => item.id !== id));
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        <th>Edit</th>
                        <th>Hapus</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
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
        </div>
    );
};

export default DataPelanggan;
