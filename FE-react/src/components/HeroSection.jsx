import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HeroSection() {
    const { user } = useAuth();

    return (
        <section className="hero" id="hero-section">
            <div className="hero-content">
                <h1>Temukan Produk Digital Terbaik</h1>
                <p>
                    MarketPlace Digital menyediakan berbagai produk digital berkualitas tinggi. 
                    Software, template, aset desain, dan masih banyak lagi — semua tersedia di satu tempat.
                </p>
                <div className="hero-buttons">
                    <Link to="/products" className="btn btn-primary">
                        🔍 Jelajahi Produk
                    </Link>
                    {!user && (
                        <Link to="/register" className="btn btn-outline">
                            ✨ Daftar Gratis
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
