import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [citasHoy, setCitasHoy] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalPacientes: 0,
    citasHoy: 0,
    citasSemana: 0
  });

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      await Promise.all([
        cargarCitasHoy(),
        cargarEstadisticas()
      ]);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarCitasHoy = async () => {
    try {
      const response = await fetch(`${API_URL}/citas`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Error al cargar citas');

      const todasCitas = await response.json();
      
      // Filtrar citas de hoy
      const hoy = new Date().toISOString().split('T')[0];
      const citasDeHoy = todasCitas.filter(cita => {
        const fechaCita = new Date(cita.fecha_cita).toISOString().split('T')[0];
        return fechaCita === hoy;
      }).sort((a, b) => new Date(a.fecha_cita) - new Date(b.fecha_cita));

      setCitasHoy(citasDeHoy);

      // Cargar datos del primer paciente si hay citas
      if (citasDeHoy.length > 0) {
        await cargarDatosPaciente(citasDeHoy[0].paciente_id);
      }
    } catch (err) {
      console.error('Error:', err);
      setCitasHoy([]);
    }
  };

  const cargarDatosPaciente = async (pacienteId) => {
    try {
      console.log('🔍 Cargando paciente ID:', pacienteId);
      
      const response = await fetch(`${API_URL}/pacientes/${pacienteId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Error al cargar paciente');

      const paciente = await response.json();
      console.log('👤 Paciente cargado:', paciente);
      setPacienteSeleccionado(paciente);
    } catch (err) {
      console.error('❌ Error al cargar paciente:', err);
      setPacienteSeleccionado(null);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      // Cargar total de pacientes
      const pacientesResponse = await fetch(`${API_URL}/pacientes`, {
        headers: getAuthHeaders()
      });

      if (pacientesResponse.ok) {
        const pacientes = await pacientesResponse.json();
        
        // Cargar todas las citas
        const citasResponse = await fetch(`${API_URL}/citas`, {
          headers: getAuthHeaders()
        });

        if (citasResponse.ok) {
          const todasCitas = await citasResponse.json();
          
          const hoy = new Date();
          const inicioSemana = new Date(hoy);
          inicioSemana.setDate(hoy.getDate() - hoy.getDay());
          const finSemana = new Date(inicioSemana);
          finSemana.setDate(inicioSemana.getDate() + 6);

          const citasSemana = todasCitas.filter(cita => {
            const fechaCita = new Date(cita.fecha_cita);
            return fechaCita >= inicioSemana && fechaCita <= finSemana;
          });

          const citasHoyCount = todasCitas.filter(cita => {
            const fechaCita = new Date(cita.fecha_cita).toISOString().split('T')[0];
            const hoyStr = hoy.toISOString().split('T')[0];
            return fechaCita === hoyStr;
          });

          setEstadisticas({
            totalPacientes: pacientes.length,
            citasHoy: citasHoyCount.length,
            citasSemana: citasSemana.length
          });
        }
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  const formatearHora = (fechaHora) => {
    if (!fechaHora) return 'N/A';
    const fecha = new Date(fechaHora);
    return fecha.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const verHistorialCompleto = () => {
    navigate('/historial-clinico');
  };

  const irACalendario = () => {
    navigate('/calendario');
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Resumen Clínico</h2>
        <p className="text-slate-500">Bienvenido de nuevo, Doctor</p>
      </header>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pacientes</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{estadisticas.totalPacientes}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Citas Hoy</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{estadisticas.citasHoy}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Esta Semana</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{estadisticas.citasSemana}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 012 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">

        {/* Agenda Section */}
        <section className="flex-1">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Agenda de Hoy</h2>
            <button 
              onClick={irACalendario}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-lg shadow-lg transition duration-150 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {citasHoy.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-lg">No hay citas programadas para hoy</p>
                <button 
                  onClick={irACalendario}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150"
                >
                  Ir al Calendario
                </button>
              </div>
            ) : (
              citasHoy.map((cita) => (
                <div 
                  key={cita.id} 
                  className="bg-white hover:bg-gray-50 p-5 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-all border-l-4 border-blue-500"
                  onClick={() => cargarDatosPaciente(cita.paciente_id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-lg">{formatearHora(cita.fecha_cita)}</div>
                      <div className="text-gray-600 text-sm">{cita.detalle_cita || 'Consulta general'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {cita.telefono && (
                      <div className="text-sm text-gray-500">
                        📞 {cita.telefono}
                      </div>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Patient Details Sidebar - SIMPLIFICADO */}
        <aside className="w-full xl:w-96">
          <div className="bg-white p-6 rounded-lg shadow-xl h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Detalles del Paciente</h2>
              {pacienteSeleccionado && (
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            {pacienteSeleccionado ? (
              <>
                <div className="space-y-6">
                  {/* Nombre del Paciente */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nombre Completo</label>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                    </p>
                  </div>
                  
                  {/* Teléfono */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {pacienteSeleccionado.telefono || 'No registrado'}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={verHistorialCompleto}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out mt-8 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Ver Historial Completo
                </button>
              </>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-gray-500">
                  Selecciona una cita para ver los detalles del paciente
                </p>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}