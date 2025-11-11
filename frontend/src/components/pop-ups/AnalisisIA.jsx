import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function AnalisisIA({ paciente: propPaciente, historiales: propHistoriales, consulta: propConsulta, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const paciente = propPaciente || location.state?.paciente;
  const historiales = propHistoriales || location.state?.historiales || [];
  const consulta = propConsulta || location.state?.consulta || null;

  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paciente) {
      if (onClose) onClose(); else navigate('/historial-clinico');
    }
  }, [paciente, navigate, onClose]);

  const iniciarAnalisis = async () => {
    setAnalizando(true);
    setResultado(null);
    setError(null);
    try {
      const body = {
        paciente_id: paciente?.id || null,
        consulta_id: consulta?.id || null,
        diagnostico: consulta?.diagnostico || paciente?.diagnostico || "",
        historiales
      };

      const res = await fetch(`${API_URL}/ia/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(txt || 'Error del servidor IA');
      }

      const data = await res.json();
      setResultado({
        resumen: data.resumen || data.summary || 'Sin resumen',
        recomendaciones: data.recomendaciones || data.recommendations || [],
        riesgos: data.riesgos || data.risks || [],
        estadisticas: data.estadisticas || {}
      });
    } catch (err) {
      setError(err.message || 'Error al analizar con IA');
      console.error(err);
    } finally {
      setAnalizando(false);
    }
  };

  if (!paciente) return null;

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Análisis con IA</h1>
          <p className="text-sm text-gray-600">
            Paciente: <span className="font-semibold">{paciente.nombre} {paciente.apellidos}</span>
            {consulta && <span className="text-sm text-gray-500 ml-3">— Consulta seleccionada</span>}
          </p>
        </div>
        <button onClick={() => { if (onClose) onClose(); else navigate('/historial-clinico'); }} className="text-blue-600 hover:underline">Volver</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {!resultado && !analizando && (
          <div className="text-center py-12">
            <p className="mb-6 text-gray-600">Presiona el botón para analizar el diagnóstico con IA.</p>
            <button onClick={iniciarAnalisis} className="bg-purple-600 text-white px-6 py-2 rounded-lg">Iniciar Análisis</button>
          </div>
        )}

        {analizando && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Analizando...</p>
            <div className="loader mx-auto" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 mb-4">{error}</div>
        )}

        {resultado && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Resumen</h3>
              <p className="text-gray-700">{resultado.resumen}</p>
            </div>
            <div>
              <h4 className="font-semibold">Recomendaciones</h4>
              <ul className="list-disc pl-6 text-gray-700">
                {resultado.recomendaciones.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Riesgos</h4>
              <ul className="list-disc pl-6 text-gray-700">
                {resultado.riesgos.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => setResultado(null)} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Nuevo Análisis</button>
              <button onClick={() => { if (onClose) onClose(); else navigate('/historial-clinico'); }} className="px-4 py-2 border rounded-lg">Volver</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}