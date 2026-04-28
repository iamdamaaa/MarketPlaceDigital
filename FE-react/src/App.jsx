import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman utama otomatis arahkan ke login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Daftarkan alamat /register */}
        <Route path="/register" element={<Register />} />

        {/* Daftarkan alamat /login */}
        <Route path="/login" element={<Login />} />
        
      </Routes>
    </Router>
  );
}

export default App;