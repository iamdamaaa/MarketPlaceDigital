import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ordering, setOrdering] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => { fetchProduct(); }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data.data);
        } catch {
            setMessage({ type: 'error', text: 'Produk tidak ditemukan' });
        } finally { setLoading(false); }
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    const handleOrder = async () => {
        if (!user) { navigate('/login'); return; }
        setOrdering(true);
        setMessage({ type: '', text: '' });
        try {
            await api.post('/orders', { product_id: product.id, quantity });
            setMessage({ type: 'success', text: 'Pesanan berhasil dibuat! Cek halaman pesanan Anda.' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal membuat pesanan' });
        } finally { setOrdering(false); }
    };

    if (loading) return <div className="page-container"><div className="loading"><div className="spinner"></div></div></div>;
    if (!product) return <div className="page-container"><div className="empty-state"><div className="empty-icon">❌</div><h3>Produk tidak ditemukan</h3></div></div>;

    return (
        <div className="page-container" id="product-detail-page">
            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
                <div className="product-card-image" style={{ height: '360px', borderRadius: 'var(--radius-lg)' }}>
                    {product.thumbnail ? <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} /> : <span style={{ fontSize: '4rem' }}>📦</span>}
                </div>
                <div>
                    {product.category && <span className="product-card-category">{product.category.name}</span>}
                    <h1 style={{ marginTop: '8px', marginBottom: '16px' }}>{product.title}</h1>
                    <p style={{ color: 'var(--gray-500)', marginBottom: '24px', lineHeight: '1.8' }}>{product.description}</p>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--maroon)', fontFamily: 'var(--font-heading)', marginBottom: '24px' }}>
                        {formatPrice(product.price)}
                    </div>
                    {product.seller && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', marginBottom: '24px' }}>
                            Penjual: <strong style={{ color: 'var(--gray-800)' }}>{product.seller.name}</strong>
                        </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Jumlah:</label>
                        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            style={{ width: '80px', padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '1rem' }} />
                    </div>
                    <div style={{ padding: '16px 20px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--gray-600)' }}>Total:</span>
                        <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--maroon)' }}>{formatPrice(product.price * quantity)}</span>
                    </div>
                    <button className="btn btn-maroon" style={{ width: '100%', padding: '16px', fontSize: '1rem' }} onClick={handleOrder} disabled={ordering}>
                        {ordering ? 'Memproses...' : '🛒 Pesan Sekarang'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
