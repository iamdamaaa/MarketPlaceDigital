import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registrasi gagal.';
            const errors = err.response?.data?.errors;
            if (errors) {
                const firstError = Object.values(errors)[0];
                setError(Array.isArray(firstError) ? firstError[0] : msg);
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="brand-logo">✨</div>
                </div>
                <h2>Buat Akun Baru</h2>
                <p className="auth-subtitle">Bergabung dengan MarketPlace Digital</p>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleRegister} id="register-form">
                    <div className="form-group">
                        <label htmlFor="name">Nama Lengkap</label>
                        <input id="name" name="name" type="text" placeholder="Masukkan nama lengkap" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-email">Email</label>
                        <input id="reg-email" name="email" type="email" placeholder="nama@email.com" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-password">Password</label>
                        <input id="reg-password" name="password" type="password" placeholder="Minimal 8 karakter" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-password-confirm">Konfirmasi Password</label>
                        <input id="reg-password-confirm" name="password_confirmation" type="password" placeholder="Ulangi password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <div className="auth-footer">
                    Sudah punya akun? <Link to="/login">Masuk</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;