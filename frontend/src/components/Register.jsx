import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8000";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo_electronico: "",
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage("Registro exitoso! Redirigiendo al login...");
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Error en el registro");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Registro</h1>
          <p className="text-gray-600 mt-2">Crea tu cuenta de doctor</p>
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
              Nombre(s)
            </label>
            <input 
              id="nombre" 
              name="nombre" 
              type="text"
              placeholder="Juan"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="apellido_paterno" className="block text-sm font-medium text-gray-700">
              Apellido Paterno
            </label>
            <input 
              id="apellido_paterno" 
              name="apellido_paterno" 
              type="text"
              placeholder="Pérez"
              value={formData.apellido_paterno}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="apellido_materno" className="block text-sm font-medium text-gray-700">
              Apellido Materno
            </label>
            <input 
              id="apellido_materno" 
              name="apellido_materno" 
              type="text"
              placeholder="García"
              value={formData.apellido_materno}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="correo_electronico" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input 
              id="correo_electronico" 
              name="correo_electronico" 
              type="email"
              placeholder="doctor@ejemplo.com"
              value={formData.correo_electronico}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input 
              id="contrasena" 
              name="contrasena" 
              type="password"
              placeholder="••••••••"
              value={formData.contrasena}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm 
                         font-semibold text-white bg-blue-600 hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
            
            <button 
              type="button"
              onClick={goToLogin}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm 
                         font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                         transition duration-150 ease-in-out"
            >
              Ya tengo cuenta - Login
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}