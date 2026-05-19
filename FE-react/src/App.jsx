import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import './App.css';

function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="page-container"><div className="loading"><div className="spinner"></div></div></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

    return children;
}

function GuestRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="page-container"><div className="loading"><div className="spinner"></div></div></div>;
    if (user) return <Navigate to="/" replace />;
    return children;
}

function AppLayout() {
    return (
        <>
            <Navbar />
            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        </Router>
    );
}

export default App;