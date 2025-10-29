import { useState, useEffect } from 'react';

const API_URL = "http://localhost:8000";

export default function HistorialClinico() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [historiales, setHistoriales] = useState([]);
  const [showModalConsulta, setShowModalConsulta] = useState(false);
  const [showModalPaciente, setShowModalPaciente] = useState(false);
  const [showModalEditarPaciente, setShowModalEditarPaciente] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nuevaConsulta, setNuevaConsulta] = useState({
    medicamento: '',
    tratamiento: '',
    diagnostico: '',
    notas: ''
  });

  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: '',
    apellidos: '',
    genero: 'M',
    edad: '',
    its: false,
    problemas_cardíacos: false,
    diabetes: false,
    telefono: '',
    correo_electronico: '',
    fecha_nacimiento: ''
  });

  const [pacienteEditar, setPacienteEditar] = useState({
    nombre: '',
    apellidos: '',
    genero: 'M',
    edad: '',
    its: false,
    problemas_cardíacos: false,
    diabetes: false,
    telefono: '',
    correo_electronico: '',
    fecha_nacimiento: ''
  });

  // Función para calcular la edad
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '';
    
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
  };

  // Actualizar edad cuando cambia la fecha de nacimiento (Nuevo Paciente)
  useEffect(() => {
    if (nuevoPaciente.fecha_nacimiento) {
      const edad = calcularEdad(nuevoPaciente.fecha_nacimiento);
      setNuevoPaciente(prev => ({ ...prev, edad: edad }));
    }
  }, [nuevoPaciente.fecha_nacimiento]);

  // Actualizar edad cuando cambia la fecha de nacimiento (Editar Paciente)
  useEffect(() => {
    if (pacienteEditar.fecha_nacimiento) {
      const edad = calcularEdad(pacienteEditar.fecha_nacimiento);
      setPacienteEditar(prev => ({ ...prev, edad: edad }));
    }
  }, [pacienteEditar.fecha_nacimiento]);

  // Cargar pacientes al montar el componente
  useEffect(() => {
    cargarPacientes();
  }, []);

  // Cargar historiales cuando se selecciona un paciente
  useEffect(() => {
    if (pacienteSeleccionado) {
      cargarHistoriales(pacienteSeleccionado.id);
    }
  }, [pacienteSeleccionado]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const cargarPacientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/pacientes`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Error al cargar pacientes');

      const data = await response.json();
      setPacientes(data);
      
      if (data.length > 0 && !pacienteSeleccionado) {
        setPacienteSeleccionado(data[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarHistoriales = async (pacienteId) => {
    try {
      const response = await fetch(`${API_URL}/historiales/paciente/${pacienteId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Error al cargar historiales');

      const data = await response.json();
      setHistoriales(data);
    } catch (err) {
      console.error('Error:', err);
      setHistoriales([]);
    }
  };

  const handleSubmitConsulta = async (e) => {
    e.preventDefault();
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Construir el payload sin doctor_id si es null
      const payload = {
        paciente_id: pacienteSeleccionado.id,
        diagnostico: nuevaConsulta.diagnostico,
        medicamento: nuevaConsulta.medicamento || null,
        tratamiento: nuevaConsulta.tratamiento || null,
        notas: nuevaConsulta.notas || null
      };

      // Solo agregar doctor_id si existe
      if (user.id) {
        payload.doctor_id = user.id;
      }

      console.log('Enviando payload:', payload);
      
      const response = await fetch(`${API_URL}/historiales`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error(JSON.stringify(errorData.detail || errorData));
      }

      await cargarHistoriales(pacienteSeleccionado.id);
      setShowModalConsulta(false);
      setNuevaConsulta({
        medicamento: '',
        tratamiento: '',
        diagnostico: '',
        notas: ''
      });
    } catch (err) {
      console.error('Error completo:', err);
      alert('Error al crear consulta: ' + err.message);
    }
  };

  const handleSubmitPaciente = async (e) => {
    e.preventDefault();
    
    try {
      const edadCalculada = calcularEdad(nuevoPaciente.fecha_nacimiento);
      
      const response = await fetch(`${API_URL}/pacientes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...nuevoPaciente,
          edad: edadCalculada
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear paciente');
      }

      const pacienteCreado = await response.json();
      await cargarPacientes();
      setPacienteSeleccionado(pacienteCreado);
      setShowModalPaciente(false);
      setNuevoPaciente({
        nombre: '',
        apellidos: '',
        genero: 'M',
        edad: '',
        its: false,
        problemas_cardíacos: false,
        diabetes: false,
        telefono: '',
        correo_electronico: '',
        fecha_nacimiento: ''
      });
    } catch (err) {
      alert('Error al crear paciente: ' + err.message);
      console.error('Error completo:', err);
    }
  };

  const handleEditarPaciente = (paciente) => {
    setPacienteEditar({
      nombre: paciente.nombre,
      apellidos: paciente.apellidos,
      genero: paciente.genero,
      edad: paciente.edad || '',
      its: paciente.its || false,
      problemas_cardíacos: paciente.problemas_cardíacos || false,
      diabetes: paciente.diabetes || false,
      telefono: paciente.telefono || '',
      correo_electronico: paciente.correo_electronico || '',
      fecha_nacimiento: paciente.fecha_nacimiento ? new Date(paciente.fecha_nacimiento).toISOString().split('T')[0] : ''
    });
    setShowModalEditarPaciente(true);
  };

  const handleSubmitEditarPaciente = async (e) => {
    e.preventDefault();
    
    try {
      const edadCalculada = calcularEdad(pacienteEditar.fecha_nacimiento);
      
      const response = await fetch(`${API_URL}/pacientes/${pacienteSeleccionado.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...pacienteEditar,
          edad: edadCalculada
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar paciente');
      }

      await cargarPacientes();
      setShowModalEditarPaciente(false);
    } catch (err) {
      alert('Error al actualizar paciente: ' + err.message);
      console.error('Error completo:', err);
    }
  };

  const eliminarConsulta = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta consulta?')) return;

    try {
      const response = await fetch(`${API_URL}/historiales/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Error al eliminar consulta');

      await cargarHistoriales(pacienteSeleccionado.id);
    } catch (err) {
      alert('Error al eliminar consulta: ' + err.message);
    }
  };

  const eliminarPaciente = async () => {
    if (!window.confirm('¿Está seguro de eliminar este paciente? Se eliminarán también todos sus historiales.')) return;

    try {
      const response = await fetch(`${API_URL}/pacientes/${pacienteSeleccionado.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Error al eliminar paciente');

      await cargarPacientes();
      setPacienteSeleccionado(pacientes.length > 1 ? pacientes[0] : null);
    } catch (err) {
      alert('Error al eliminar paciente: ' + err.message);
    }
  };

  const pacientesFiltrados = pacientes.filter(p =>
    `${p.nombre} ${p.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-96">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Historial Clínico</h1>

      <div className="flex flex-col lg:flex-row gap-8">
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
              {pacientesFiltrados.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No hay pacientes registrados</p>
              ) : (
                pacientesFiltrados.map(paciente => (
                  <div 
                    key={paciente.id}
                    onClick={() => setPacienteSeleccionado(paciente)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      pacienteSeleccionado?.id === paciente.id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <h3 className="font-bold text-gray-900">
                      {paciente.nombre} {paciente.apellidos}
                    </h3>
                    <p className="text-sm text-gray-600">{paciente.telefono}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="w-full lg:w-2/3">
          {pacienteSeleccionado ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Historial de {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellidos}
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditarPaciente(pacienteSeleccionado)}
                    className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span>Editar</span>
                  </button>
                  <button 
                    onClick={() => setShowModalConsulta(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    <span>Nueva Consulta</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {historiales.length === 0 ? (
                  <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-gray-500">No hay consultas registradas para este paciente</p>
                  </div>
                ) : (
                  historiales.map(consulta => (
                    <div key={consulta.id} className="bg-white p-5 rounded-lg shadow-md">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {consulta.diagnostico && (
                            <>
                              <h3 className="text-lg font-semibold text-gray-900">Diagnóstico</h3>
                              <p className="text-gray-700 mt-1">{consulta.diagnostico}</p>
                            </>
                          )}
                          
                          {consulta.tratamiento && (
                            <div className="mt-3">
                              <h4 className="text-sm font-semibold text-gray-700">Tratamiento</h4>
                              <p className="text-gray-600 mt-1">{consulta.tratamiento}</p>
                            </div>
                          )}

                          {consulta.medicamento && (
                            <div className="mt-3">
                              <h4 className="text-sm font-semibold text-gray-700">Medicamento</h4>
                              <p className="text-gray-600 mt-1">{consulta.medicamento}</p>
                            </div>
                          )}
                          
                          {consulta.notas && (
                            <div className="mt-3">
                              <h4 className="text-sm font-semibold text-gray-700">Notas</h4>
                              <p className="text-sm text-gray-500 mt-1 italic">{consulta.notas}</p>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => eliminarConsulta(consulta.id)}
                          className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
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
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500">Selecciona un paciente para ver su historial</p>
            </div>
          )}
        </section>
      </div>

      {/* Modal Nueva Consulta */}
      {showModalConsulta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Nueva Consulta</h3>
                  <p className="text-blue-100 mt-1">Paciente: {pacienteSeleccionado?.nombre} {pacienteSeleccionado?.apellidos}</p>
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
                    Tratamiento
                  </label>
                  <textarea
                    value={nuevaConsulta.tratamiento}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, tratamiento: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Descripción del tratamiento realizado..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medicamento
                  </label>
                  <textarea
                    value={nuevaConsulta.medicamento}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, medicamento: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Medicamentos recetados..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    value={nuevaConsulta.notas}
                    onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, notas: e.target.value })}
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

      {/* Modal Nuevo Paciente */}
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
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevoPaciente.apellidos}
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, apellidos: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Apellidos completos"
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Edad (calculada automáticamente)
                  </label>
                  <input
                    type="number"
                    disabled
                    value={nuevoPaciente.edad}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    placeholder="Se calcula automáticamente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Género *
                  </label>
                  <select
                    required
                    value={nuevoPaciente.genero}
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, genero: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono *
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Condiciones Médicas
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={nuevoPaciente.its}
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, its: e.target.checked })}
                        className="mr-2 w-4 h-4"
                      />
                      <span>ITS</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={nuevoPaciente.problemas_cardíacos}
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, problemas_cardíacos: e.target.checked })}
                        className="mr-2 w-4 h-4"
                      />
                      <span>Problemas Cardíacos</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={nuevoPaciente.diabetes}
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, diabetes: e.target.checked })}
                        className="mr-2 w-4 h-4"
                      />
                      <span>Diabetes</span>
                    </label>
                  </div>
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

      {/* Modal Editar Paciente */}
      {showModalEditarPaciente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            
            <div className="bg-yellow-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">Editar Paciente</h3>
                  <p className="text-yellow-100 mt-1">Actualizar información del paciente</p>
                </div>
                <button 
                  onClick={() => setShowModalEditarPaciente(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitEditarPaciente} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={pacienteEditar.nombre}
                    onChange={(e) => setPacienteEditar({ ...pacienteEditar, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Nombre(s)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    value={pacienteEditar.apellidos}
                    onChange={(e) => setPacienteEditar({ ...pacienteEditar, apellidos: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Apellidos completos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    required
                    value={pacienteEditar.fecha_nacimiento}
                    onChange={(e) => setPacienteEditar({ ...pacienteEditar, fecha_nacimiento: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Edad (calculada automáticamente)
                  </label>
                  <input
                    type="number"
                    disabled
                    value={pacienteEditar.edad}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    placeholder="Se calcula automáticamente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Género *
                  </label>
                  <select
                    required
                    value={pacienteEditar.genero}
                    onChange={(e) => setPacienteEditar({ ...pacienteEditar, genero: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={pacienteEditar.telefono}
                    onChange={(e) => setPacienteEditar({ ...pacienteEditar, telefono: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="81-1234-5678"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={pacienteEditar.correo_electronico}
                    onChange={(e) => setPacienteEditar({ ...pacienteEditar, correo_electronico: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="correo@ejemplo.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Condiciones Médicas
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pacienteEditar.its}
                        onChange={(e) => setPacienteEditar({ ...pacienteEditar, its: e.target.checked })}
                        className="mr-2 w-4 h-4"
                      />
                      <span>ITS</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pacienteEditar.problemas_cardíacos}
                        onChange={(e) => setPacienteEditar({ ...pacienteEditar, problemas_cardíacos: e.target.checked })}
                        className="mr-2 w-4 h-4"
                      />
                      <span>Problemas Cardíacos</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pacienteEditar.diabetes}
                        onChange={(e) => setPacienteEditar({ ...pacienteEditar, diabetes: e.target.checked })}
                        className="mr-2 w-4 h-4"
                      />
                      <span>Diabetes</span>
                    </label>
                  </div>
                </div>

              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModalEditarPaciente(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 shadow-md transition-colors"
                >
                  Actualizar Paciente
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
