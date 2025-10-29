import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8000";

export default function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    
    try {
      // Usar FormData como lo tenías antes
      const formData = new FormData();
      formData.append('username', loginData.username);
      formData.append('password', loginData.password);

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Login exitoso!");
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.access_token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Actualizar estado de autenticación
        setIsAuthenticated(true);
        
        // Redirigir al dashboard
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm p-8 rounded-xl shadow-xl">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Login</h1>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <div className="mt-1">
              <input 
                id="username" 
                name="username" 
                type="email" 
                placeholder="correo@ejemplo.com"
                value={loginData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="mt-1">
              <input 
                id="password" 
                name="password" 
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400
                           focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 space-y-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm 
                         font-semibold text-white bg-blue-600 hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Login'}
            </button>
            
            <button 
              type="button"
              onClick={goToRegister}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm 
                         font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
                         transition duration-150 ease-in-out"
            >
              Registro
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}