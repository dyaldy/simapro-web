import "./DetailKategori.css";
import { FaEdit, FaPlusSquare, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DataPelanggan = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://sazura.xyz/api/v1/customers")
            .then((response) => response.json())
            .then((json) => {
                setData(json.data || []); // Pastikan sesuai struktur JSON dari API
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const handleDelete = (customerName) => {
        alert(`Apakah Anda yakin ingin menghapus ${customerName}?`);
    };

    if (loading) return <p>Loading data...</p>;

    return (
        <div className='container'>
            <h1>DATA PELANGGAN</h1>

            <div className="top-bar">
                <input 
                    type="text" 
                    placeholder="Cari Pelanggan..." 
                    className="search-input" 
                />
                <FaPlusSquare 
                    className="icon plus-icon"
                    onClick={() => navigate("/tambah-pelanggan")}
                />
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
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
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
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
                                    onClick={() => handleDelete(item.name)}
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
