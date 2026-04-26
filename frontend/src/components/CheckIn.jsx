import React, { useState } from 'react';

const CheckIn = () => {
  const [telefono, setTelefono] = useState('');

  const manejarConfirmacion = async (e) => {
    e.preventDefault();
    
    try {
      const API_URL = "http://localhost:8000"; 
      
      const response = await fetch(`${API_URL}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefono: telefono })
      });

      const data = await response.json();

      if (response.ok) {
        // se confirmo con el backend la cita
        alert("✅ " + data.message);
        setTelefono(''); // Limpiar el formulario
      } else {
        // el paciente no existe o no tiene cita error
        alert("❌ " + data.detail);
      }

    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Error de conexión. Asegúrate de estar conectado a la red de la clínica.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        {}
        <div className="flex justify-center mb-6">
          <span className="text-5xl">🦷</span> 
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Bienvenido a la Clínica
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Ingresa tu número de celular para confirmar tu cita de hoy.
        </p>

        <form onSubmit={manejarConfirmacion} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono Celular
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej. 8112345678"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Confirmar Llegada
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckIn;