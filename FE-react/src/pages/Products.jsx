import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('category_id') || '';
    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, categoryId, page]);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories?all=true');
            setCategories(res.data.data || []);
        } catch { /* ignore */ }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (categoryId) params.set('category_id', categoryId);
            params.set('page', page);
            params.set('per_page', 12);
            const res = await api.get(`/products?${params.toString()}`);
            setProducts(res.data.data || []);
            setMeta(res.data.meta || {});
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const updateParam = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) { params.set(key, value); } else { params.delete(key); }
        if (key !== 'page') params.delete('page');
        setSearchParams(params);
    };

    return (
        <div className="page-container" id="products-page">
            <div className="page-header">
                <h1>Semua Produk</h1>
                <p>Temukan produk digital yang Anda butuhkan</p>
            </div>

            <div className="search-bar">
                <input
                    type="text" placeholder="🔍 Cari produk..." defaultValue={search}
                    onKeyDown={(e) => { if (e.key === 'Enter') updateParam('search', e.target.value); }}
                />
                <select value={categoryId} onChange={(e) => updateParam('category_id', e.target.value)}>
                    <option value="">Semua Kategori</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>Produk tidak ditemukan</h3>
                    <p>Coba ubah kata kunci atau filter Anda.</p>
                </div>
            ) : (
                <>
                    <div className="product-grid">
                        {products.map((product, i) => (
                            <div key={product.id} style={{ animationDelay: `${i * 0.05}s` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                    {meta.last_page > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
                            {Array.from({ length: meta.last_page }, (_, i) => (
                                <button key={i + 1}
                                    className={`btn btn-sm ${page === i + 1 ? 'btn-maroon' : 'btn-outline'}`}
                                    style={page !== i + 1 ? { color: 'var(--maroon)', borderColor: 'var(--maroon)' } : {}}
                                    onClick={() => updateParam('page', i + 1)}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Products;
