import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import DataProduk from './Pages/DataProduk';
import DetailKategori from './Pages/DetailKategori';
import DataPelanggan from './Pages/DataPelanggan';
import DetailPenjualan from './Pages/DetailPenjualan';
import TambahProduk from './Tambah/TambahProduk';
import TambahPenjualan from './Tambah/TambahPenjualan';
import TambahPelanggan from './Tambah/TambahPelanggan';
import EditProduk from './Edit/EditProduk';
import EditPelanggan from './Edit/EditPelanggan';
import Login from './Pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/',
    element: <Sidebar />, // sidebar jadi layout utama setelah login
    children: [
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'data-produk',
        element: <DataProduk />,
      },
      {
        path: 'tambah-produk', // ✅ tambahkan ini
        element: <TambahProduk />,
      },
      {
        path: 'edit-produk', // ✅ tambahkan ini
        element: <EditProduk />,
      },
      {
        path: 'detail-kategori',
        element: <DetailKategori />,
      },
      {
        path: 'data-pelanggan',
        element: <DataPelanggan />,
      },
      {
        path: 'tambah-pelanggan', // ✅ tambahkan ini
        element: <TambahPelanggan />,
      },
      {
        path: 'edit-pelanggan', // ✅ tambahkan ini
        element: <EditPelanggan />,
      },
      {
        path: 'detail-penjualan',
        element: <DetailPenjualan />,
      },
      {
        path: 'tambah-penjualan', // ✅ tambahkan ini
        element: <TambahPenjualan />,
      },
    ],
  },
]);


function App() {

  // fungsi

  //return beisi route
  return <RouterProvider router={router} />;
}

export default App;