import React, { useEffect, useState, useCallback } from "react";
import "./DataProduk.css";
import { FaEdit, FaPlusSquare, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DataProduk = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = localStorage.getItem("token");

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://sazura.xyz/api/v1/products?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      const json = await response.json();
      setData(json.data || []);
      setTotalPages(json.meta?.last_page || 1);
      setTotalItems(json.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("https://sazura.xyz/api/v1/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const json = await response.json();
      setCategories(json.data || []);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
  }, [fetchProducts, fetchCategories, currentPage]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (cat) => Number(cat.id) === Number(categoryId)
    );
    return category ? category.name : "Tidak Diketahui";
  };

  const handleDelete = async (productName, productId) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${productName}"?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://sazura.xyz/api/v1/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Gagal menghapus produk");

      alert("Produk berhasil dihapus!");
      fetchProducts(currentPage); // refresh halaman saat ini
    } catch (error) {
      console.error("Error saat menghapus:", error);
      alert("Terjadi kesalahan saat menghapus produk");
    }
  };

  const filteredData = data.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>DATA PRODUK</h1>

      <div className="top-bar">
        <input
          type="text"
          placeholder="Cari Nama Produk..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <FaPlusSquare
          className="icon plus-icon"
          onClick={() => navigate("/tambah-produk")}
          title="Tambah Produk"
        />
      </div>

      <p>Total Produk: {totalItems}</p>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Produk</th>
                <th>Stok</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Nama Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    Tidak ada data produk yang sesuai
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.amount}</td>
                    <td>
                      {item.price
                        ? `Rp ${parseInt(item.price).toLocaleString("id-ID")}`
                        : "Rp 0"}
                    </td>
                    <td
                      className={
                        item.status === "a"
                          ? "status-aktif"
                          : item.status === "n"
                          ? "status-nonaktif"
                          : ""
                      }
                    >
                      {item.status === "a"
                        ? "Aktif"
                        : item.status === "n"
                        ? "Nonaktif"
                        : item.status || "-"}
                    </td>
                    <td>{getCategoryName(item.categoryId)}</td>
                    <td>
                      <FaEdit
                        className="icon edit"
                        onClick={() => navigate(`/edit-produk/${item.id}`)}
                        title="Edit Produk"
                        style={{ marginRight: "10px" }}
                      />
                      <FaTrash
                        className="icon delete"
                        onClick={() => handleDelete(item.name, item.id)}
                        title="Hapus Produk"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`pagination-button ${
                  currentPage === page ? "active" : ""
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DataProduk;
