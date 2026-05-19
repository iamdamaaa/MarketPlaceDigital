// Laravel Echo configuration for real-time notifications
// Requires: npm install laravel-echo pusher-js

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || 'your-app-key',
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'ap1',
    forceTLS: true,
    authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
        },
    },
});

/**
 * Listen for order status updates on the user's private channel
 * Usage:
 *   import { listenForOrderUpdates } from './api/echo';
 *   listenForOrderUpdates(userId, (data) => { console.log(data); });
 */
export function listenForOrderUpdates(userId, callback) {
    echo.private(`user.${userId}`)
        .listen('.order.status.updated', callback);
}

/**
 * Listen for new order alerts on the admin channel
 * Usage:
 *   import { listenForNewOrders } from './api/echo';
 *   listenForNewOrders((data) => { console.log(data); });
 */
export function listenForNewOrders(callback) {
    echo.private('admin')
        .listen('.order.new', callback);
}

/**
 * Disconnect Echo
 */
export function disconnectEcho() {
    echo.disconnect();
}

export default echo;
