import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.data || []);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (loading) return <div className="page-container"><div className="loading"><div className="spinner"></div></div></div>;

    return (
        <div className="page-container" id="orders-page">
            <div className="page-header">
                <h1>Pesanan Saya</h1>
                <p>Riwayat dan status pesanan Anda</p>
            </div>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>Belum ada pesanan</h3>
                    <p>Mulai belanja dan temukan produk digital terbaik.</p>
                    <Link to="/products" className="btn btn-maroon">Jelajahi Produk</Link>
                </div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Produk</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Tanggal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td><strong>#{order.id}</strong></td>
                                <td>{order.product?.title || '-'}</td>
                                <td>{order.quantity}</td>
                                <td style={{ fontWeight: '600', color: 'var(--maroon)' }}>{formatPrice(order.total_price)}</td>
                                <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                                <td style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{formatDate(order.created_at)}</td>
                                <td><Link to={`/orders/${order.id}`} className="btn btn-sm btn-maroon">Detail</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Orders;
