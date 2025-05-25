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
import Register from './Pages/Register'; // ✅ Tambahan

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register', // ✅ Tambahan
    element: <Register />,
  },
  {
    path: '/',
    element: <Sidebar />,
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
        path: 'tambah-produk',
        element: <TambahProduk />,
      },
      {
        path: 'edit-produk/:id',
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
        path: 'edit-pelanggan/:id',
        element: <EditPelanggan />,
      },
      {
        path: 'tambah-pelanggan',
        element: <TambahPelanggan />,
      },
      {
        path: 'edit-pelanggan',
        element: <EditPelanggan />,
      },
      {
        path: 'detail-penjualan',
        element: <DetailPenjualan />,
      },
      {
        path: 'tambah-penjualan',
        element: <TambahPenjualan />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
