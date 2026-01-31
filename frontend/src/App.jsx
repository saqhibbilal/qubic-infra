import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RegisterAsset from './pages/RegisterAsset';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';

function App() {
  // Estado global de usuario (Simulación de Auth)
  const [user, setUser] = useState(null);

  // Si no hay usuario logueado, mostramos la Login Page limpia
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={() => setUser(null)}>
        <Routes>
          {/* Ruta Principal: Depende del rol */}
          <Route
            path="/"
            element={
              user === 'admin'
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/dashboard" replace />
            }
          />

          {/* Rutas Comunes */}
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/register" element={<RegisterAsset currentUser={user} />} />

          {/* Dashboard reutilizado:
              - Para Admin: Es el panel de validación
              - Para Usuario: Es "Mis Activos" (Portfolio)
          */}
          <Route
            path="/dashboard"
            element={<Dashboard currentUser={user} />} // Pasamos el usuario como prop
          />

          <Route path="*" element={<div className="p-10 text-center text-primary font-medium">404 - Not Found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
