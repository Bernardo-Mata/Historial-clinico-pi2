// ExampleComponent.jsx
// Componente de ejemplo reutilizable
import React, { useState } from 'react';
import axios from 'axios';

function ExampleComponent() {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Maneja el envío seguro del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('/example', { name });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error desconocido');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
      {result && <div>Respuesta: {JSON.stringify(result)}</div>}
      {error && <div style={{color: 'red'}}>Error: {error}</div>}
    </div>
  );
}

export default ExampleComponent;
