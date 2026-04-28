import { useState } from 'react';
import api from '../api/axios'; // Pastikan kamu sudah buat file axios.js tadi
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Memanggil API Laravel
            const response = await api.post('/login', {
                email: email,
                password: password
            });

            // Simpan token ke browser (seperti auto-fill di Postman tadi)
            localStorage.setItem('token', response.data.token);
            
            alert('Login Berhasil!');
            navigate('/home'); // Pindah ke halaman home setelah sukses
        } catch (error) {
            alert('Login Gagal: ' + error.response?.data?.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Login Marketplace</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label><br/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <br/>
                <div>
                    <label>Password:</label><br/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;