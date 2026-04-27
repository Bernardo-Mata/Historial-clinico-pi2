import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const FormularioFeedback = () => {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
    
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [accionSugerida, setAccionSugerida] = useState(null);

  const [formData, setFormData] = useState({
    nivel_dolor: 0,
    control_medicacion: 'Sí',
    sangrado: 'Nulo',
    inflamacion: 'Normal',
    fiebre: false,
    dificultad_tragar: false,
    mal_sabor: false,
    entumecimiento: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'nivel_dolor' ? parseInt(value) : value)
    }));
  };

  const determinarAccion = (nivel) => {
    if (nivel <= 3) return { 
        titulo: "Normal", 
        msg: "Continuar con el plan de recuperación estándar. Refuerzo positivo.",
        color: "text-green-600"
    };
    if (nivel <= 6) return { 
        titulo: "Precaución", 
        msg: "Registro en bitácora; sugerir ajuste de analgésicos según receta. Si persiste más de 24h, notificar al asistente dental.",
        color: "text-yellow-600"
    };
    if (nivel <= 8) return { 
        titulo: "Anomalía (Alerta Amarilla)", 
        msg: "Notificación al odontólogo para revisión de protocolo.",
        color: "text-orange-600"
    };
    return { 
        titulo: "Crítico (Alerta Roja)", 
        msg: "Disparo de inmediato de emergencia. Llamada inmediata del clínico o acudir a urgencias.",
        color: "text-red-600"
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        console.log("Enviando feedback:", { ...formData, paciente_id: parseInt(pacienteId) });
        
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, paciente_id: parseInt(pacienteId) })
      });
      
      if (response.ok) {
        setEnviado(true);
        setAccionSugerida(determinarAccion(formData.nivel_dolor));
      }
    } catch (error) {
      console.error("Error enviando feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">¡Gracias por tu respuesta!</h2>
        <div className={`p-4 rounded-md bg-gray-50 border-l-4 ${accionSugerida.color === 'text-green-600' ? 'border-green-500' : accionSugerida.color === 'text-yellow-600' ? 'border-yellow-500' : 'border-red-500'}`}>
          <p className={`font-bold ${accionSugerida.color}`}>{accionSugerida.titulo}</p>
          <p className="mt-2 text-gray-700">{accionSugerida.msg}</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-3xl font-extrabold text-indigo-900 mb-2">Seguimiento Post-operatorio</h1>
      <p className="text-gray-600 mb-8 border-b pb-4">Tu salud es nuestra prioridad. Por favor, responde con sinceridad.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nivel de Dolor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nivel de Dolor: (0 al 10)
            <span className="block font-normal text-xs text-gray-500">¿Cuánto dolor siente en este momento? (0=nada, 10=insoportable)</span>
          </label>
          <input 
            type="range" min="0" max="10" name="nivel_dolor"
            value={formData.nivel_dolor} onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs font-bold text-indigo-600 mt-1">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
          </div>
          <p className="text-center font-bold text-indigo-700 mt-2">Valor actual: {formData.nivel_dolor}</p>
        </div>

        {/* Control con Medicación */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Control con Medicación</label>
          <select name="control_medicacion" value={formData.control_medicacion} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500">
            <option>Sí</option>
            <option>Parcialmente</option>
            <option>No</option>
          </select>
        </div>

        {/* Sangrado */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Estado del Sangrado</label>
          <select name="sangrado" value={formData.sangrado} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500">
            <option>Nulo</option>
            <option>Mancha leve la saliva</option>
            <option>Sangrado activo que no para</option>
          </select>
        </div>

        {/* Inflamacion */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Inflamación (Hinchazón)</label>
          <select name="inflamacion" value={formData.inflamacion} onChange={handleChange} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500">
            <option>Normal</option>
            <option>Un poco hinchada</option>
            <option>Muy hinchada y tensa</option>
          </select>
        </div>

        {/* Sitemas Adicionales */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <label className="block text-sm font-bold text-indigo-900 mb-3">SÍNTOMAS ADICIONALES</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'fiebre', label: 'Fiebre o escalofríos' },
              { id: 'dificultad_tragar', label: 'Dificultad para abrir/tragar' },
              { id: 'mal_sabor', label: 'Mal sabor de boca' },
              { id: 'entumecimiento', label: 'Entumecimiento persistente' }
            ].map(item => (
              <label key={item.id} className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer hover:bg-white p-1 rounded transition">
                <input 
                  type="checkbox" name={item.id} checked={formData[item.id]} 
                  onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar Reporte de Salud'}
        </button>
      </form>
    </div>
  );
};

export default FormularioFeedback;
