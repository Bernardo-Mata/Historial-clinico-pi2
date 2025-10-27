import { useState } from 'react';

const API_URL = "http://localhost:8000";

export default function Dashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('inicio');

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
      // Limpiar token del localStorage siempre
      console.log('Limpiando token...');
      localStorage.removeItem('token');
      
      // Redirigir al login
      console.log('Redirigiendo al login...');
      if (onLogout) {
        onLogout();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-blue-900 text-white flex flex-col">
        
        <div className="h-20 flex items-center justify-start px-6">
          <h1 className="text-2xl font-bold">🦷 Dental</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setActiveMenu('inicio'); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold ${
              activeMenu === 'inicio' 
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
            onClick={(e) => { e.preventDefault(); setActiveMenu('historial'); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold ${
              activeMenu === 'historial' 
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
            onClick={(e) => { e.preventDefault(); setActiveMenu('calendario'); }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold ${
              activeMenu === 'calendario' 
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

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 bg-slate-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resumen Clínico</h1>

        <div className="flex flex-col xl:flex-row gap-8">

          {/* Agenda Section */}
          <section className="flex-1">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Agenda de Hoy</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-lg shadow-lg transition duration-150 ease-in-out">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-gray-800">09:00</div>
                    <div className="text-gray-600">María García</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-800 bg-blue-100 px-3 py-1 rounded-full">Limpieza</span>
              </div>

              <div className="bg-sky-50 p-4 rounded-lg shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-gray-800">10:30</div>
                    <div className="text-gray-600">Juan Pérez</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">Extracción</span>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-gray-800">14:00</div>
                    <div className="text-gray-600">Ana López</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-sky-800 bg-sky-100 px-3 py-1 rounded-full">Ortodoncia</span>
              </div>

            </div>
          </section>

          {/* Patient Details Sidebar */}
          <aside className="w-full xl:w-96">
            <div className="bg-white p-6 rounded-lg shadow-xl h-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Detalles del Paciente</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">María García</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">81-1234-5678</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Última Visita</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">2025-10-05</p>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out mt-8">
                Ver Historial Completo
              </button>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}