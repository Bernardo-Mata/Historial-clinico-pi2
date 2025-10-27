import { useState } from 'react';

const API_URL = "http://localhost:8000";

export default function Register({ onRegisterSuccess, onBackToLogin }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo_electronico: "",
    profesion: "",
    telefono: "",
    cedula: "",
    contrasena: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("¡Registro exitoso! Redirigiendo al dashboard...");
        
        // Auto-login después del registro
        const loginFormData = new FormData();
        loginFormData.append('username', formData.correo_electronico);
        loginFormData.append('password', formData.contrasena);

        const loginResponse = await fetch(`${API_URL}/login`, {
          method: 'POST',
          body: loginFormData
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          localStorage.setItem('token', loginData.access_token);
          
          setTimeout(() => {
            onRegisterSuccess();
          }, 1500);
        }
      } else {
        const data = await response.json();
        setError(data.detail || "Error al registrar usuario");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl my-8">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Registro</h1>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <div className="mt-1">
              <input 
                id="nombre" 
                name="nombre" 
                type="text" 
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">
              Apellidos
            </label>
            <div className="mt-1">
              <input 
                id="apellidos" 
                name="apellidos" 
                type="text" 
                value={formData.apellidos}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="mt-1">
              <input 
                id="contrasena" 
                name="contrasena" 
                type="password" 
                value={formData.contrasena}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="profesion" className="block text-sm font-medium text-gray-700">
              Especialidad
            </label>
            <div className="mt-1">
              <input 
                id="profesion" 
                name="profesion" 
                type="text" 
                value={formData.profesion}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="correo_electronico" className="block text-sm font-medium text-gray-700">
              Correo
            </label>
            <div className="mt-1">
              <input 
                id="correo_electronico" 
                name="correo_electronico" 
                type="email" 
                value={formData.correo_electronico}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <div className="mt-1">
              <input 
                id="telefono" 
                name="telefono" 
                type="tel" 
                value={formData.telefono}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">
              Cédula
            </label>
            <div className="mt-1">
              <input 
                id="cedula" 
                name="cedula" 
                type="text" 
                value={formData.cedula}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm 
                         font-semibold text-white bg-blue-600 hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
            
            <button 
              type="button"
              onClick={onBackToLogin}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm 
                         font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                         transition duration-150 ease-in-out"
            >
              Volver
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}