import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Memanggil API Register Laravel
            const response = await api.post('/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
                role: 'buyer' // Default role untuk mempermudah tugas
            });

            alert('Register Berhasil! Silakan Login.');
            navigate('/login'); // Pindah ke halaman login setelah sukses
        } catch (error) {
            // Menampilkan error validasi dari Laravel (misal: email sudah ada)
            const errorMsg = error.response?.data?.message || 'Terjadi kesalahan';
            alert('Register Gagal: ' + errorMsg);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Daftar Akun Baru</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Nama Lengkap:</label><br/>
                    <input type="text" name="name" onChange={handleChange} required />
                </div>
                <br/>
                <div>
                    <label>Email:</label><br/>
                    <input type="email" name="email" onChange={handleChange} required />
                </div>
                <br/>
                <div>
                    <label>Password:</label><br/>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <br/>
                <div>
                    <label>Konfirmasi Password:</label><br/>
                    <input type="password" name="password_confirmation" onChange={handleChange} required />
                </div>
                <br/>
                <button type="submit">Daftar Sekarang</button>
            </form>
        </div>
    );
}

export default Register;