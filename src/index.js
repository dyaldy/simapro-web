import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './context/UserContext';  // Import UserProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>  {/* Bungkus App dengan UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>
);

// Jika kamu ingin mengukur performa aplikasi, bisa mengirimkan hasilnya ke analytics
reportWebVitals();
