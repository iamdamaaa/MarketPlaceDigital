import { useState, useEffect } from 'react';
import api from '../api/axios';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products?per_page=8');
            setProducts(res.data.data || []);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="home-page">
            <HeroSection />
            <div className="page-container">
                <h2 className="section-title">Produk Terbaru</h2>
                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>Belum ada produk</h3>
                        <p>Produk akan segera tersedia.</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map((product, i) => (
                            <div key={product.id} style={{ animationDelay: `${i * 0.1}s` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
