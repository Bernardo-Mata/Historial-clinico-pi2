import { useState } from 'react';
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

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [citas, setCitas] = useState([
    {
      id: 1,
      paciente: 'María García',
      fecha: new Date(2025, 9, 10, 9, 0), // 10 de octubre, 9:00
      motivo: 'Limpieza',
      color: 'blue'
    },
    {
      id: 2,
      paciente: 'Juan Pérez',
      fecha: new Date(2025, 9, 10, 10, 30), // 10 de octubre, 10:30
      motivo: 'Extracción',
      color: 'indigo'
    },
    {
      id: 3,
      paciente: 'Ana López',
      fecha: new Date(2025, 9, 10, 14, 0), // 10 de octubre, 14:00
      motivo: 'Ortodoncia',
      color: 'sky'
    }
  ]);

  const [nuevaCita, setNuevaCita] = useState({
    paciente: '',
    hora: '',
    motivo: '',
    color: 'blue'
  });

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
    return citas.filter(cita => isSameDay(cita.fecha, fecha));
  };

  // Navegar entre meses
  const mesAnterior = () => setCurrentDate(subMonths(currentDate, 1));
  const mesSiguiente = () => setCurrentDate(addMonths(currentDate, 1));

  // Agregar nueva cita
  const agregarCita = (e) => {
    e.preventDefault();
    
    const [hora, minutos] = nuevaCita.hora.split(':');
    const fechaCita = new Date(selectedDate);
    fechaCita.setHours(parseInt(hora), parseInt(minutos));

    const cita = {
      id: Date.now(),
      paciente: nuevaCita.paciente,
      fecha: fechaCita,
      motivo: nuevaCita.motivo,
      color: nuevaCita.color
    };

    setCitas([...citas, cita]);
    setShowModal(false);
    setNuevaCita({ paciente: '', hora: '', motivo: '', color: 'blue' });
  };

  // Eliminar cita
  const eliminarCita = (id) => {
    setCitas(citas.filter(cita => cita.id !== id));
  };

  const dias = generarDiasCalendario();
  const citasDelDiaSeleccionado = obtenerCitasDelDia(selectedDate);

  // Calcular estadísticas
  const totalPacientes = new Set(citas.map(c => c.paciente)).size;
  const citasEsteMes = citas.filter(c => isSameMonth(c.fecha, currentDate)).length;
  const citasPendientes = citas.filter(c => c.fecha > new Date()).length;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendario</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Calendario principal */}
        <section className="flex-1 bg-white p-6 rounded-lg shadow-xl">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
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
            <p className="text-sm text-gray-500 mb-5">
              {format(selectedDate, "d 'de' MMMM", { locale: es })}
            </p>
            
            <div className="space-y-4 flex-1 overflow-y-auto max-h-96">
              {citasDelDiaSeleccionado.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No hay citas para este día</p>
              ) : (
                citasDelDiaSeleccionado
                  .sort((a, b) => a.fecha - b.fecha)
                  .map(cita => (
                    <div 
                      key={cita.id} 
                      className={`bg-${cita.color}-50 p-3 rounded-lg border-l-4 border-${cita.color}-500 relative group`}
                    >
                      <p className="font-semibold text-sm text-gray-900">
                        {format(cita.fecha, 'HH:mm')}
                      </p>
                      <p className="text-gray-700">{cita.paciente}</p>
                      <p className={`text-xs text-${cita.color}-700 font-medium`}>
                        {cita.motivo}
                      </p>
                      <button
                        onClick={() => eliminarCita(cita.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.218-2.34.425a.75.75 0 00-.5.696V6.25a.75.75 0 00.75.75h.75v8.75A2.25 2.25 0 007.75 18h4.5A2.25 2.25 0 0014.5 15.75V7h.75a.75.75 0 00.75-.75V4.664a.75.75 0 00-.5-.696A18.68 18.68 0 0014 3.75v-.443A2.75 2.75 0 0011.25 1h-2.5zM7.5 4.5v-.75A1.25 1.25 0 018.75 2.5h2.5A1.25 1.25 0 0112.5 3.75v.75h-5z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))
              )}
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nueva Cita</h3>
            <p className="text-sm text-gray-500 mb-6">
              {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>

            <form onSubmit={agregarCita} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paciente
                </label>
                <input
                  type="text"
                  required
                  value={nuevaCita.paciente}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, paciente: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Nombre del paciente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  required
                  value={nuevaCita.hora}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, hora: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo
                </label>
                <input
                  type="text"
                  required
                  value={nuevaCita.motivo}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, motivo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ej: Limpieza, Extracción, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <select
                  value={nuevaCita.color}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="blue">Azul</option>
                  <option value="indigo">Índigo</option>
                  <option value="sky">Cielo</option>
                  <option value="green">Verde</option>
                  <option value="yellow">Amarillo</option>
                  <option value="red">Rojo</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
