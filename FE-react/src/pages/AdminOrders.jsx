import { useState, useEffect } from 'react';
import api from '../api/axios';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filter, setFilter] = useState('');

    useEffect(() => { fetchOrders(); }, [filter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = filter ? `?status=${filter}` : '';
            const res = await api.get(`/orders${params}`);
            setOrders(res.data.data || []);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);
    const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    const updateStatus = async (orderId, newStatus) => {
        setMessage({ type: '', text: '' });
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setMessage({ type: 'success', text: `Status pesanan #${orderId} berhasil diperbarui ke ${newStatus}` });
            fetchOrders();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal mengubah status' });
        }
    };

    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    return (
        <div className="page-container" id="admin-orders-page">
            <div className="page-header">
                <h1>Kelola Pesanan</h1>
                <p>Lihat dan perbarui status pesanan pelanggan</p>
            </div>

            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            <div className="search-bar">
                <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ minWidth: '200px' }}>
                    <option value="">Semua Status</option>
                    {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>Tidak ada pesanan</h3>
                    <p>Belum ada pesanan yang masuk.</p>
                </div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr><th>ID</th><th>Pembeli</th><th>Produk</th><th>Qty</th><th>Total</th><th>Status</th><th>Tanggal</th><th>Ubah Status</th></tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td><strong>#{order.id}</strong></td>
                                <td>{order.user?.name || '-'}</td>
                                <td>{order.product?.title || '-'}</td>
                                <td>{order.quantity}</td>
                                <td style={{ fontWeight: '600', color: 'var(--maroon)' }}>{formatPrice(order.total_price)}</td>
                                <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{formatDate(order.created_at)}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)', fontSize: '0.8rem', cursor: 'pointer' }}
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminOrders;
