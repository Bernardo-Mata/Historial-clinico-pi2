import React, { useState } from 'react';

const API_URL = "http://localhost:8000";

export default function NuevaConsulta({ paciente, onClose, onSaved }) {
  const [nuevaConsulta, setNuevaConsulta] = useState({
    diagnostico: '',
    tratamiento: '',
    medicamento: '',
    notas: ''
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
      const payload = {
        paciente_id: paciente?.id,
        diagnostico: nuevaConsulta.diagnostico,
        tratamiento: nuevaConsulta.tratamiento,
        medicamento: nuevaConsulta.medicamento,
        notas: nuevaConsulta.notas
      };

      const res = await fetch(`${API_URL}/historiales`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Error al crear consulta');
      }

      // notify parent
      if (onSaved) onSaved();
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
        <div className="bg-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Nueva Consulta</h3>
              <p className="text-blue-100 mt-1">Paciente: {paciente?.nombre} {paciente?.apellidos}</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">✕</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnóstico *</label>
              <input
                type="text"
                required
                value={nuevaConsulta.diagnostico}
                onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, diagnostico: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Caries dental, Gingivitis..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tratamiento</label>
              <textarea
                value={nuevaConsulta.tratamiento}
                onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, tratamiento: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Descripción del tratamiento..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Medicamento</label>
              <textarea
                value={nuevaConsulta.medicamento}
                onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, medicamento: e.target.value })}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Medicamentos recetados..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notas Adicionales</label>
              <textarea
                value={nuevaConsulta.notas}
                onChange={(e) => setNuevaConsulta({ ...nuevaConsulta, notas: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Notas, recomendaciones..."
              />
            </div>
          </div>

          {error && <div className="mt-4 text-red-600">{error}</div>}

          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">{loading ? 'Guardando...' : 'Guardar Consulta'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
