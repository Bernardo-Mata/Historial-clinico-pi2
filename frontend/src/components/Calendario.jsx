import { useState, useEffect } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  format, 
  isSameMonth, 
  isSameDay, 
  parseISO 
} from 'date-fns';
import { es } from 'date-fns/locale';

const API_URL = "http://localhost:8000";

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nuevaCita, setNuevaCita] = useState({
    paciente_id: '',
    doctor_id: '',
    fecha_cita: '',
    hora: '',
    detalle_cita: '',
    telefono: '',
    correo_electronico: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      await Promise.all([
        cargarCitas(),
        cargarPacientes(),
        cargarDoctores()
      ]);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarCitas = async () => {
    try {
      const response = await fetch(`${API_URL}/citas`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Error al cargar citas');

      const data = await response.json();
      setCitas(data);
    } catch (err) {
      console.error('Error:', err);
      setCitas([]);
    }
  };

  const cargarPacientes = async () => {
    try {
      const response = await fetch(`${API_URL}/pacientes`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Error al cargar pacientes');

      const data = await response.json();
      setPacientes(data);
    } catch (err) {
      console.error('Error:', err);
      setPacientes([]);
    }
  };

  const cargarDoctores = async () => {
    try {
      const response = await fetch(`${API_URL}/doctores`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Error al cargar doctores');

      const data = await response.json();
      setDoctores(data);
    } catch (err) {
      console.error('Error:', err);
      setDoctores([]);
    }
  };

  // Generar días del calendario
  const generarDiasCalendario = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const dias = [];
    let dia = startDate;

    while (dia <= endDate) {
      dias.push(dia);
      dia = addDays(dia, 1);
    }

    return dias;
  };

  // Obtener citas de un día específico
  const obtenerCitasDelDia = (fecha) => {
    return citas.filter(cita => {
      const fechaCita = new Date(cita.fecha_cita);
      return isSameDay(fechaCita, fecha);
    });
  };

  // Navegar entre meses
  const mesAnterior = () => setCurrentDate(subMonths(currentDate, 1));
  const mesSiguiente = () => setCurrentDate(addMonths(currentDate, 1));

  // Abrir modal con fecha preseleccionada
  const abrirModalNuevaCita = () => {
    const fechaSeleccionada = format(selectedDate, 'yyyy-MM-dd');
    setNuevaCita({
      paciente_id: '',
      doctor_id: '',
      fecha_cita: fechaSeleccionada,
      hora: '09:00',
      detalle_cita: '',
      telefono: '',
      correo_electronico: ''
    });
    setShowModal(true);
  };

  // Agregar nueva cita
  const agregarCita = async (e) => {
    e.preventDefault();
    
    try {
      // Combinar fecha y hora
      const fechaHoraCompleta = `${nuevaCita.fecha_cita}T${nuevaCita.hora}:00`;
      
      const pacienteSeleccionado = pacientes.find(p => p.id === parseInt(nuevaCita.paciente_id));
      
      const payload = {
        paciente_id: parseInt(nuevaCita.paciente_id),
        doctor_id: nuevaCita.doctor_id ? parseInt(nuevaCita.doctor_id) : null,
        fecha_cita: fechaHoraCompleta,
        detalle_cita: nuevaCita.detalle_cita,
        telefono: nuevaCita.telefono || pacienteSeleccionado?.telefono || '',
        correo_electronico: nuevaCita.correo_electronico || pacienteSeleccionado?.correo_electronico || ''
      };

      console.log('Enviando cita:', payload);

      const response = await fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear cita');
      }

      await cargarCitas();
      setShowModal(false);
      setNuevaCita({
        paciente_id: '',
        doctor_id: '',
        fecha_cita: '',
        hora: '',
        detalle_cita: '',
        telefono: '',
        correo_electronico: ''
      });
    } catch (err) {
      console.error('Error completo:', err);
      alert('Error al crear cita: ' + err.message);
    }
  };

  // Eliminar cita
  const eliminarCita = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta cita?')) return;

    try {
      const response = await fetch(`${API_URL}/citas/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Error al eliminar cita');

      await cargarCitas();
    } catch (err) {
      alert('Error al eliminar cita: ' + err.message);
    }
  };

  // Auto-completar datos del paciente
  const handlePacienteChange = (pacienteId) => {
    const paciente = pacientes.find(p => p.id === parseInt(pacienteId));
    if (paciente) {
      setNuevaCita({
        ...nuevaCita,
        paciente_id: pacienteId,
        telefono: paciente.telefono || '',
        correo_electronico: paciente.correo_electronico || ''
      });
    } else {
      setNuevaCita({
        ...nuevaCita,
        paciente_id: pacienteId
      });
    }
  };

  const dias = generarDiasCalendario();
  const citasDelDiaSeleccionado = obtenerCitasDelDia(selectedDate);

  // Calcular estadísticas
  const totalPacientes = pacientes.length;
  const citasEsteMes = citas.filter(c => isSameMonth(new Date(c.fecha_cita), currentDate)).length;
  const citasPendientes = citas.filter(c => new Date(c.fecha_cita) > new Date()).length;

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendario</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Calendario principal */}
        <section className="flex-1 bg-white p-6 rounded-lg shadow-xl">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={mesAnterior}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Anterior
              </button>
              <button 
                onClick={mesSiguiente}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Siguiente
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
              <div key={dia} className="text-center font-semibold text-gray-500 text-sm py-2">
                {dia}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-2">
            {dias.map((dia, idx) => {
              const citasDelDia = obtenerCitasDelDia(dia);
              const esDelMes = isSameMonth(dia, currentDate);
              const esHoy = isSameDay(dia, new Date());
              const esDiaSeleccionado = isSameDay(dia, selectedDate);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(dia)}
                  className={`
                    min-h-[60px] p-2 rounded-lg cursor-pointer transition-colors
                    ${!esDelMes ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-100'}
                    ${esHoy ? 'ring-2 ring-blue-500' : ''}
                    ${esDiaSeleccionado ? 'bg-blue-50' : ''}
                    ${citasDelDia.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                  `}
                >
                  <div className={`text-center ${citasDelDia.length > 0 ? 'font-bold' : ''}`}>
                    {format(dia, 'd')}
                  </div>
                  {citasDelDia.length > 0 && (
                    <div className="text-xs text-center mt-1">
                      {citasDelDia.length} {citasDelDia.length === 1 ? 'cita' : 'citas'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Panel lateral - Agenda del día */}
        <aside className="w-full lg:w-80">
          <div className="bg-white p-6 rounded-lg shadow-xl h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800">Agenda</h3>
            <p className="text-sm text-gray-500 mb-5 capitalize">
              {format(selectedDate, "d 'de' MMMM", { locale: es })}
            </p>
            
            <div className="space-y-4 flex-1 overflow-y-auto max-h-96">
              {citasDelDiaSeleccionado.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No hay citas para este día</p>
              ) : (
                citasDelDiaSeleccionado
                  .sort((a, b) => new Date(a.fecha_cita) - new Date(b.fecha_cita))
                  .map(cita => {
                    const paciente = pacientes.find(p => p.id === cita.paciente_id);
                    return (
                      <div 
                        key={cita.id} 
                        className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 relative group"
                      >
                        <p className="font-semibold text-sm text-gray-900">
                          {format(new Date(cita.fecha_cita), 'HH:mm')}
                        </p>
                        <p className="text-gray-700 font-medium">
                          {paciente ? `${paciente.nombre} ${paciente.apellidos}` : 'Paciente no encontrado'}
                        </p>
                        <p className="text-xs text-blue-700 font-medium">
                          {cita.detalle_cita || 'Sin detalles'}
                        </p>
                        {cita.telefono && (
                          <p className="text-xs text-gray-600 mt-1">
                            📞 {cita.telefono}
                          </p>
                        )}
                        <button
                          onClick={() => eliminarCita(cita.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.218-2.34.425a.75.75 0 00-.5.696V6.25a.75.75 0 00.75.75h.75v8.75A2.25 2.25 0 007.75 18h4.5A2.25 2.25 0 0014.5 15.75V7h.75a.75.75 0 00.75-.75V4.664a.75.75 0 00-.5-.696A18.68 18.68 0 0014 3.75v-.443A2.75 2.75 0 0011.25 1h-2.5zM7.5 4.5v-.75A1.25 1.25 0 018.75 2.5h2.5A1.25 1.25 0 0112.5 3.75v.75h-5z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    );
                  })
              )}
            </div>
            
            <button 
              onClick={abrirModalNuevaCita}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out mt-6"
            >
              + Nueva Cita
            </button>
          </div>
        </aside>
      </div>

      {/* Estadísticas */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Datos del Historial Clínico</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="text-sm font-medium text-gray-500">Total de Pacientes</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{totalPacientes}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="text-sm font-medium text-gray-500">Consultas Este Mes</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{citasEsteMes}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <p className="text-sm font-medium text-gray-500">Citas Pendientes</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">{citasPendientes}</p>
          </div>

        </div>
      </section>

      {/* Modal para nueva cita */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nueva Cita</h3>

            <form onSubmit={agregarCita} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paciente *
                </label>
                <select
                  required
                  value={nuevaCita.paciente_id}
                  onChange={(e) => handlePacienteChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione un paciente</option>
                  {pacientes.map(paciente => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nombre} {paciente.apellidos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor (Opcional)
                </label>
                <select
                  value={nuevaCita.doctor_id}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, doctor_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin asignar</option>
                  {doctores.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.nombre} {doctor.apellidos} - {doctor.profesion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  required
                  value={nuevaCita.fecha_cita}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, fecha_cita: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora *
                </label>
                <input
                  type="time"
                  required
                  value={nuevaCita.hora}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, hora: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo/Detalle de la Cita *
                </label>
                <input
                  type="text"
                  required
                  value={nuevaCita.detalle_cita}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, detalle_cita: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Limpieza dental, Extracción, Revisión..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={nuevaCita.telefono}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 81-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={nuevaCita.correo_electronico}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, correo_electronico: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
