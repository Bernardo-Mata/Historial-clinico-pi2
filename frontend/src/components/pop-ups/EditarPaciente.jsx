import React, { useState } from 'react';

const API_URL = "http://localhost:8000";

export default function EditarPaciente({ paciente, onClose, onUpdated }) {
  const [form, setForm] = useState({
    nombre: paciente?.nombre || '',
    apellidos: paciente?.apellidos || '',
    fecha_nacimiento: paciente?.fecha_nacimiento ? paciente.fecha_nacimiento.split('T')[0] : '',
    genero: paciente?.genero || '',
    telefono: paciente?.telefono || '',
    edad: paciente?.edad || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...form };
      // backend expects fields: nombre, apellidos, fecha_nacimiento, genero, telefono, edad
      const res = await fetch(`${API_URL}/pacientes/${paciente.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Error al actualizar paciente');
      }

      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-green-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Editar Paciente</h3>
              <p className="text-green-100 mt-1">Editar información del paciente</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">✕</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
              <input className="w-full px-3 py-2 border rounded" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Apellidos</label>
              <input className="w-full px-3 py-2 border rounded" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Nacimiento</label>
              <input type="date" className="w-full px-3 py-2 border rounded" value={form.fecha_nacimiento} onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Género</label>
              <select className="w-full px-3 py-2 border rounded" value={form.genero} onChange={(e) => setForm({ ...form, genero: e.target.value })}>
                <option value="">-- Seleccione --</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
              <input className="w-full px-3 py-2 border rounded" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Edad</label>
              <input type="number" className="w-full px-3 py-2 border rounded" value={form.edad} onChange={(e) => setForm({ ...form, edad: e.target.value })} />
            </div>
          </div>

          {error && <div className="mt-4 text-red-600">{error}</div>}

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">{loading ? 'Actualizando...' : 'Actualizar Paciente'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
