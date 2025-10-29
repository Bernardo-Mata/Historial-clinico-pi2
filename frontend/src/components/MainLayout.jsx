import { useState } from 'react';
import Dashboard from './dashboard';
import HistorialClinico from './HistorialClinico';
import Calendario from './Calendario';

const API_URL = "http://localhost:8000";

export default function MainLayout({ onLogout }) {
  const [activeView, setActiveView] = useState('inicio');

  const handleLogout = async () => {
    console.log('Iniciando logout...');
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token obtenido:', token ? 'Existe' : 'No existe');
      
      if (token) {
        console.log('Llamando al endpoint de logout...');
        
        const response = await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Respuesta del servidor:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Logout exitoso:', data);
        } else {
          console.error('Error en logout:', response.status);
        }
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      console.log('Limpiando token...');
      localStorage.removeItem('token');
      
      console.log('Redirigiendo al login...');
      if (onLogout) {
        onLogout();
      } else {
        window.location.reload();
      }
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'inicio':
        return <Dashboard />;
      case 'historial':
        return <HistorialClinico />;
      case 'calendario':
        return <Calendario />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar - Fijo con altura completa */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col fixed h-screen">
        
        <div className="h-20 flex items-center justify-start px-6 flex-shrink-0">
          <h1 className="text-2xl font-bold">🦷 Dental</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveView('inicio'); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold ${
              activeView === 'inicio' 
                ? 'bg-indigo-900 text-white' 
                : 'text-indigo-200 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6-4a1 1 0 001-1v-1a1 1 0 10-2 0v1a1 1 0 001 1z" />
            </svg>
            <span>Inicio</span>
          </a>

          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveView('historial'); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold ${
              activeView === 'historial' 
                ? 'bg-indigo-900 text-white' 
                : 'text-indigo-200 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Historial Clínico</span>
          </a>

          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveView('calendario'); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold ${
              activeView === 'calendario' 
                ? 'bg-indigo-900 text-white' 
                : 'text-indigo-200 hover:bg-blue-800 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Calendario</span>
          </a>
        </nav>

        <div className="p-4 flex-shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content - Con margen izquierdo para el sidebar fijo */}
      <main className="flex-1 ml-64 p-6 lg:p-10 bg-slate-50 min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
}
