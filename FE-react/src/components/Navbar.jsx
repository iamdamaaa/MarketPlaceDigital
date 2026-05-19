import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'nav-active' : '';

    const handleLogout = async () => {
        await logout();
        setMenuOpen(false);
    };

    return (
        <nav className="navbar" id="main-navbar">
            <Link to="/" className="navbar-brand">
                <span className="brand-icon">🛒</span>
                MarketPlace Digital
            </Link>

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                {menuOpen ? '✕' : '☰'}
            </button>

            <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Beranda</Link>
                <Link to="/products" className={isActive('/products')} onClick={() => setMenuOpen(false)}>Produk</Link>

                {user ? (
                    <>
                        <Link to="/orders" className={isActive('/orders')} onClick={() => setMenuOpen(false)}>Pesanan</Link>
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin/products" className={isActive('/admin/products')} onClick={() => setMenuOpen(false)}>Kelola Produk</Link>
                                <Link to="/admin/orders" className={isActive('/admin/orders')} onClick={() => setMenuOpen(false)}>Kelola Pesanan</Link>
                            </>
                        )}
                        <NotificationBell />
                        <div className="navbar-user">
                            <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                            <button className="btn-logout" onClick={handleLogout}>Logout</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={isActive('/login')} onClick={() => setMenuOpen(false)}>Login</Link>
                        <Link to="/register" className={`btn btn-sm btn-outline ${isActive('/register')}`} onClick={() => setMenuOpen(false)}>Daftar</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
