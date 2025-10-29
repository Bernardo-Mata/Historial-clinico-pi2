import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import HistorialClinico from './components/HistorialClinico';
import Calendario from './components/Calendario';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay token al cargar la app
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <MainLayout setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="historial-clinico" element={<HistorialClinico />} />
        <Route path="calendario" element={<Calendario />} />
      </Route>

      {/* Redirigir cualquier ruta no encontrada */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
