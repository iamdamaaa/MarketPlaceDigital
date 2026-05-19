import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer" id="main-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h3>🛒 MarketPlace Digital</h3>
                    <p>Platform toko online terpercaya untuk produk digital berkualitas. Temukan software, template, dan aset digital terbaik untuk kebutuhan Anda.</p>
                </div>
                <div className="footer-links">
                    <h4>Navigasi</h4>
                    <ul>
                        <li><Link to="/">Beranda</Link></li>
                        <li><Link to="/products">Produk</Link></li>
                        <li><Link to="/orders">Pesanan Saya</Link></li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h4>Informasi</h4>
                    <ul>
                        <li><a href="#" aria-label="Tentang Kami">Tentang Kami</a></li>
                        <li><a href="#" aria-label="Kebijakan Privasi">Kebijakan Privasi</a></li>
                        <li><a href="#" aria-label="Syarat & Ketentuan">Syarat & Ketentuan</a></li>
                        <li><a href="#" aria-label="Kontak">Kontak</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MarketPlace Digital. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
