import { useState } from 'react';

export default function HistorialClinico() {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState({
    id: 1,
    nombre: 'María García',
    telefono: '81-1234-5678'
  });
  
  const [showModalConsulta, setShowModalConsulta] = useState(false);
  const [showModalPaciente, setShowModalPaciente] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  
  const [pacientes, setPacientes] = useState([
    { id: 1, nombre: 'María García', apellido_paterno: 'García', apellido_materno: 'López', telefono: '81-1234-5678', correo_electronico: 'maria@email.com', fecha_nacimiento: '1990-05-15', sexo: 'F', direccion: 'Av. Principal #123' },
    { id: 2, nombre: 'Juan Pérez', apellido_paterno: 'Pérez', apellido_materno: 'Gómez', telefono: '81-8765-4321', correo_electronico: 'juan@email.com', fecha_nacimiento: '1985-08-20', sexo: 'M', direccion: 'Calle Secundaria #456' },
    { id: 3, nombre: 'Ana López', apellido_paterno: 'López', apellido_materno: 'Martínez', telefono: '81-5555-6666', correo_electronico: 'ana@email.com', fecha_nacimiento: '1995-12-10', sexo: 'F', direccion: 'Blvd. Norte #789' }
  ]);

  const [historiales, setHistoriales] = useState([
    {
      id: 1,
      pacienteId: 1,
      diagnostico: 'Limpieza dental',
      tratamiento: 'Sin caries',
      doctor: 'Dr. Ramírez',
      fecha: '2025-10-05',
      observaciones: ''
    },
    {
      id: 2,
      pacienteId: 1,
      diagnostico: 'Revisión general',
      tratamiento: 'Todo normal',
      doctor: 'Dr. Ramírez',
      fecha: '2025-09-15',
      observaciones: ''
    }
  ]);

  const [nuevaConsulta, setNuevaConsulta] = useState({
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    sexo: 'M',
    telefono: '',
    correo_electronico: '',
    direccion: ''
  });

  const pacientesFiltrados = pacientes.filter(p =>
    `${p.nombre} ${p.apellido_paterno} ${p.apellido_materno}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const historialesDelPaciente = historiales.filter(
    h => h.pacienteId === pacienteSeleccionado.id
  );

  const handleSubmitConsulta = (e) => {
    e.preventDefault();
    
    const consulta = {
      id: Date.now(),
      pacienteId: pacienteSeleccionado.id,
      diagnostico: nuevaConsulta.diagnostico,
      tratamiento: nuevaConsulta.tratamiento,
      observaciones: nuevaConsulta.observaciones,
      doctor: 'Dr. Ramírez',
      fecha: nuevaConsulta.fecha
    };

    setHistoriales([consulta, ...historiales]);
    setShowModalConsulta(false);
    setNuevaConsulta({
      diagnostico: '',
      tratamiento: '',
      observaciones: '',
      fecha: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmitPaciente = (e) => {
    e.preventDefault();
    
    const paciente = {
      id: Date.now(),
      nombre: nuevoPaciente.nombre,
      apellido_paterno: nuevoPaciente.apellido_paterno,
      apellido_materno: nuevoPaciente.apellido_materno,
      fecha_nacimiento: nuevoPaciente.fecha_nacimiento,
      sexo: nuevoPaciente.sexo,
      telefono: nuevoPaciente.telefono,
      correo_electronico: nuevoPaciente.correo_electronico,
      direccion: nuevoPaciente.direccion
    };

    setPacientes([...pacientes, paciente]);
    setPacienteSeleccionado(paciente);
    setShowModalPaciente(false);
    setNuevoPaciente({
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      fecha_nacimiento: '',
      sexo: 'M',
      telefono: '',
      correo_electronico: '',
      direccion: ''
    });
  };

  const eliminarConsulta = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta consulta?')) {
      setHistoriales(historiales.filter(h => h.id !== id));
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Historial Clínico</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar de búsqueda y lista de pacientes */}
        <section className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-xl h-full">
            
            <div className="relative mb-6">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Buscar paciente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Botón Nuevo Paciente */}
            <button
              onClick={() => setShowModalPaciente(true)}
              className="w-full mb-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              <span>Nuevo Paciente</span>
            </button>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pacientesFiltrados.map(paciente => (
                <div 
                  key={paciente.id}
                  onClick={() => setPacienteSeleccionado(paciente)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    pacienteSeleccionado.id === paciente.id
                      ? 'bg-blue-100 border border-blue-300'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <h3 className="font-bold text-gray-900">
                    {paciente.nombre} {paciente.apellido_paterno} {paciente.apellido_materno}
                  </h3>
                  <p className="text-sm text-gray-600">{paciente.telefono}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de historial del paciente seleccionado */}
        <section className="w-full lg:w-2/3">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Historial de {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido_paterno}
            </h2>
            <button 
              onClick={() => setShowModalConsulta(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-150 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              <span>Nueva Consulta</span>
            </button>
          </div>

          <div className="space-y-4">
            {historialesDelPaciente.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-500">No hay consultas registradas para este paciente</p>
              </div>
            ) : (
              historialesDelPaciente.map(consulta => (
                <div key={consulta.id} className="bg-white p-5 rounded-lg shadow-md flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{consulta.diagnostico}</h3>
                    <p className="text-gray-600 mt-1">{consulta.tratamiento}</p>
                    {consulta.observaciones && (
                      <p className="text-sm text-gray-500 mt-2 italic">{consulta.observaciones}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">{consulta.doctor} - {consulta.fecha}</p>
                  </div>
                  <div className="flex space-x-3 text-gray-500">
                    <button className="hover:text-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => eliminarConsulta(consulta.id)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.218-2.34.425a.75.75 0 00-.5.696V6.25a.75.75 0 00.75.75h.75v8.75A2.25 2.25 0 007.75 18h4.5A2.25 2.25 0 0014.5 15.75V7h.75a.75.75 0 00.75-.75V4.664a.75.75 0 00-.5-.696A18.68 18.68 0 0014 3.75v-.443A2.75 2.75 0 0011.25 1h-2.5zM7.5 4.5v-.75A1.25 1.25 0 018.75 2.5h2.5A1.25 1.25 0 0112.5 3.75v.75h-5z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>

      {/* Modal para Nueva Consulta */}
      {showModalConsulta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="bg-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Nueva Consulta</h3>
                  <p className="text-blue-100 mt-1">Paciente: {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido_paterno}</p>
                </div>
                <button 
                  onClick={() => setShowModalConsulta(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitConsulta} className="p-6">
              <div className="space-y-5">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Consulta *
                  </label>
                  <input
                    type="date"
                    required
                    value={nuevaConsulta.fecha}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, fecha: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Diagnóstico *
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevaConsulta.diagnostico}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, diagnostico: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Caries dental, Gingivitis, Limpieza general..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tratamiento *
                  </label>
                  <textarea
                    required
                    value={nuevaConsulta.tratamiento}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, tratamiento: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Descripción del tratamiento realizado..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={nuevaConsulta.observaciones}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, observaciones: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Notas adicionales, recomendaciones, seguimiento..."
                  />
                </div>

              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModalConsulta(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md transition-colors"
                >
                  Guardar Consulta
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal para Nuevo Paciente */}
      {showModalPaciente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="bg-green-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Registrar Nuevo Paciente</h3>
                  <p className="text-green-100 mt-1">Complete los datos del paciente</p>
                </div>
                <button 
                  onClick={() => setShowModalPaciente(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitPaciente} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevoPaciente.nombre}
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nombre(s)"
                  />
                </div>

                {/* Apellido Paterno */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellido Paterno *
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevoPaciente.apellido_paterno}
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, apellido_paterno: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Apellido paterno"
                  />
                </div>

                {/* Apellido Materno */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellido Materno *
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevoPaciente.apellido_materno}
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, apellido_materno: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Apellido materno"
                  />
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    required
                    value={nuevoPaciente.fecha_nacimiento}
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, fecha_nacimiento: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sexo *
                  </label>
                  <select
                    required
                    value={nuevoPaciente.sexo}
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, sexo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    value={nuevoPaciente.telefono}
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="81-1234-5678"
                  />
                </div>

                {/* Correo Electrónico */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={nuevoPaciente.correo_electronico}
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, correo_electronico: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dirección
                  </label>
                  <textarea
                    value={nuevoPaciente.direccion}
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, direccion: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Calle, número, colonia, ciudad..."
                  />
                </div>

              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModalPaciente(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow-md transition-colors"
                >
                  Registrar Paciente
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
