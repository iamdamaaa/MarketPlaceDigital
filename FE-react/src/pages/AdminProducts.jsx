import { useState, useEffect } from 'react';
import api from '../api/axios';

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', price: '', category_id: '', status: 'published', thumbnail: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => { fetchProducts(); fetchCategories(); }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products?per_page=50&status=');
            setProducts(res.data.data || []);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const fetchCategories = async () => {
        try { const res = await api.get('/categories?all=true'); setCategories(res.data.data || []); } catch { /* ignore */ }
    };

    const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

    const openCreate = () => {
        setEditingProduct(null);
        setFormData({ title: '', description: '', price: '', category_id: '', status: 'published', thumbnail: '' });
        setShowModal(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setFormData({ title: product.title, description: product.description, price: product.price, category_id: product.category_id, status: product.status, thumbnail: product.thumbnail || '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const payload = { ...formData, price: parseInt(formData.price) };
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
                setMessage({ type: 'success', text: 'Produk berhasil diperbarui' });
            } else {
                await api.post('/products', payload);
                setMessage({ type: 'success', text: 'Produk berhasil ditambahkan' });
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal menyimpan produk' });
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Hapus produk "${title}"?`)) return;
        try {
            await api.delete(`/products/${id}`);
            setMessage({ type: 'success', text: 'Produk berhasil dihapus' });
            fetchProducts();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal menghapus' });
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="page-container" id="admin-products-page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div><h1>Kelola Produk</h1><p>Tambah, edit, dan hapus produk</p></div>
                <button className="btn btn-maroon" onClick={openCreate}>+ Tambah Produk</button>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr><th>ID</th><th>Produk</th><th>Kategori</th><th>Harga</th><th>Status</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>#{p.id}</td>
                                <td><strong>{p.title}</strong></td>
                                <td>{p.category?.name || '-'}</td>
                                <td style={{ fontWeight: '600', color: 'var(--maroon)' }}>{formatPrice(p.price)}</td>
                                <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                                <td style={{ display: 'flex', gap: '6px' }}>
                                    <button className="btn btn-sm btn-maroon" onClick={() => openEdit(p)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id, p.title)}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="modal">
                        <h3>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group"><label>Judul</label><input name="title" value={formData.title} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Deskripsi</label><textarea name="description" value={formData.description} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Harga (Rp)</label><input name="price" type="number" value={formData.price} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Kategori</label>
                                <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                                    <option value="">Pilih Kategori</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group"><label>Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="pending_review">Pending Review</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Thumbnail URL</label><input name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="https://..." /></div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-sm btn-outline" style={{ color: 'var(--gray-600)', borderColor: 'var(--gray-300)' }} onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className="btn btn-sm btn-maroon">{editingProduct ? 'Simpan Perubahan' : 'Tambahkan'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProducts;
