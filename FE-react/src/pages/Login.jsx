import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="brand-logo">🛒</div>
                </div>
                <h2>Selamat Datang Kembali</h2>
                <p className="auth-subtitle">Masuk ke akun MarketPlace Digital Anda</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleLogin} id="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email" type="email" placeholder="nama@email.com"
                            value={email} onChange={(e) => setEmail(e.target.value)} required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password" type="password" placeholder="Masukkan password"
                            value={password} onChange={(e) => setPassword(e.target.value)} required 
                        />
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                <div className="auth-footer">
                    Belum punya akun? <Link to="/register">Daftar Sekarang</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;