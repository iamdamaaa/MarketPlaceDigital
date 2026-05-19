import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (user) fetchNotifications();
        const interval = setInterval(() => {
            if (user) fetchNotifications();
        }, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications?per_page=10');
            setNotifications(res.data.data || []);
            setUnreadCount(res.data.unread_count || 0);
        } catch {
            // ignore
        }
    };

    const markAllRead = async () => {
        try {
            await api.post('/notifications/read');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        } catch {
            // ignore
        }
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Baru saja';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
        return `${Math.floor(seconds / 86400)} hari lalu`;
    };

    if (!user) return null;

    return (
        <div className="notification-wrapper" ref={dropdownRef}>
            <button className="notification-bell" onClick={() => setIsOpen(!isOpen)} aria-label="Notifications">
                🔔
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>Notifikasi</h4>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead}>Tandai semua dibaca</button>
                        )}
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">Belum ada notifikasi</div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif.id} className={`notification-item ${!notif.read_at ? 'unread' : ''}`}>
                                    <div className="notif-title">{notif.title}</div>
                                    <div className="notif-msg">{notif.message}</div>
                                    <div className="notif-time">{timeAgo(notif.created_at)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
