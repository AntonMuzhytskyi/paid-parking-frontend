import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-deepBlack">
        <Routes>
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />

          <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

          <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
