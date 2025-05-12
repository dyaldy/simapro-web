import axios from 'axios';

const BASE_URL = 'https://sazura.xyz/api/v1/';


export const getProduk = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/produk`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil data produk:", error);
        return [];
    }
};
