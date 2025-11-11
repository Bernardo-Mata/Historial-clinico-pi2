import { useState, useEffect } from 'react';

const API_URL = "http://localhost:8000";

export default function NuevoPaciente({ onClose, onCreated }) {
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '';
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
    return edad;
  };

  useEffect(() => {
    if (form.fecha_nacimiento) {
      setForm(prev => ({ ...prev, edad: calcularEdad(prev.fecha_nacimiento) }));
    }
  }, [form.fecha_nacimiento]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const edadCalculada = calcularEdad(form.fecha_nacimiento);
      const response = await fetch(`${API_URL}/pacientes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...form, edad: edadCalculada })
      });

      if (!response.ok) {
        const err = await response.json().catch(()=>null);
        throw new Error(err?.detail || 'Error al crear paciente');
      }

      const pacienteCreado = await response.json();
      if (onCreated) onCreated(pacienteCreado);
      if (onClose) onClose();
    } catch (err) {
      alert('Error al crear paciente: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-green-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Registrar Nuevo Paciente</h3>
              <p className="text-green-100 mt-1">Complete los datos del paciente</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
              <input required type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Nombre(s)" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Apellidos *</label>
              <input required type="text" value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Apellidos completos" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Nacimiento *</label>
              <input required type="date" value={form.fecha_nacimiento} onChange={e => setForm({ ...form, fecha_nacimiento: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Edad (calculada automáticamente)</label>
              <input type="number" disabled value={form.edad} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" placeholder="Se calcula automáticamente" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Género *</label>
              <select value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
              <input required type="tel" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="81-1234-5678" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
              <input type="email" value={form.correo_electronico} onChange={e => setForm({ ...form, correo_electronico: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="correo@ejemplo.com" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Condiciones Médicas</label>
              <div className="space-y-2">
                <label className="flex items-center"><input type="checkbox" checked={form.its} onChange={e => setForm({ ...form, its: e.target.checked })} className="mr-2 w-4 h-4" />ITS</label>
                <label className="flex items-center"><input type="checkbox" checked={form.problemas_cardíacos} onChange={e => setForm({ ...form, problemas_cardíacos: e.target.checked })} className="mr-2 w-4 h-4" />Problemas Cardíacos</label>
                <label className="flex items-center"><input type="checkbox" checked={form.diabetes} onChange={e => setForm({ ...form, diabetes: e.target.checked })} className="mr-2 w-4 h-4" />Diabetes</label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
              {loading ? 'Guardando...' : 'Registrar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}