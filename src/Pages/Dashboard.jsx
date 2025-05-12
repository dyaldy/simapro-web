import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://sazura.xyz/api/v1/customers')
      .then(res => res.json())
      .then(data => setCustomers(Array.isArray(data.data) ? data.data : []))
      .catch(err => console.error('Error fetching customers:', err));

    fetch('https://sazura.xyz/api/v1/products')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data.data) ? data.data : []))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Hitung pelanggan teraktif
  const customerCount = {};
  customers.forEach(c => {
    const name = c.name || 'Tidak diketahui';
    customerCount[name] = (customerCount[name] || 0) + 1;
  });
  const topCustomer = Object.entries(customerCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  // Produk dengan stok terbanyak
  const sortedProducts = [...products].sort((a, b) => parseInt(b.amount) - parseInt(a.amount));
  const topProduct = sortedProducts[0] || { name: '-', amount: 0 };

  const customerChart = {
    labels: Object.keys(customerCount),
    datasets: [
      {
        label: 'Jumlah',
        data: Object.values(customerCount),
        backgroundColor: ['#60a5fa', '#f472b6', '#34d399'],
      },
    ],
  };

  const productChart = {
    labels: products.map(p => p.name),
    datasets: [
      {
        label: 'Stok',
        data: products.map(p => parseInt(p.amount)),
        backgroundColor: ['#a78bfa', '#facc15', '#38bdf8'],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="top-section">
        <div className="info-card">
          <p>Produk Terlaris</p>
          <h2>{topProduct.name}</h2>
        </div>
        <div className="info-card">
          <p>Pelanggan paling sering Datang :</p>
          <h2>{topCustomer}</h2>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-card">
          <p>Total Penjualan selama 3 bulan:</p>
          <h2>{topProduct.amount} Pcs</h2>
          <div className="chart-wrapper">
            <Bar data={productChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card">
          <p>Berangkat selama 3 bulan:</p>
          <h2>{customerCount[topCustomer] || 0} Hari</h2>
          <div className="chart-wrapper">
            <Bar data={customerChart} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
