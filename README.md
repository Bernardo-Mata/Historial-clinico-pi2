# Proyecto FastAPI + React

## Descripción
Este proyecto implementa una arquitectura moderna y segura basada en FastAPI (Python) para el backend y React.js para el frontend. El objetivo y los requerimientos se basan en el PDF adjunto y el README original, pero reestructurados con las mejores prácticas y tecnologías actuales.

## Estructura
```
/Proyecto
  /backend        # API REST con FastAPI
    main.py       # Punto de entrada
    /app
      models.py   # Modelos de datos
      schemas.py  # Validaciones
      routes.py   # Endpoints
      __init__.py # Inicialización
  /frontend       # Interfaz React
    /src
      App.jsx     # Componente principal
      index.jsx   # Entrada React
      /components
        ExampleComponent.jsx # Componente ejemplo
    package.json   # Dependencias frontend
```

## Instalación

### Backend
1. Instala dependencias:
   ```sh
   pip install -r requirements.txt
   ```
2. Configura el archivo `.env`:
   ```
   MYSQL_USER=tu_usuario
   MYSQL_PASSWORD=tu_contraseña
   MYSQL_HOST=localhost
   MYSQL_DB=historial_clinico
   ```
3. Ejecuta el servidor:
   ```sh
   uvicorn main:app --reload
   ```

### Frontend
1. Instala dependencias:
   ```sh
   npm install
   ```
2. Ejecuta la app:
   ```sh
   npm start
   ```

## Seguridad
- Contraseñas hasheadas con bcrypt.
- Autenticación con JWT.
- Validación de datos con Pydantic.
- CORS habilitado para desarrollo.

## Endpoints principales
- `POST /usuarios` — Registro de usuario.
- `POST /login` — Login y obtención de JWT.
- `GET /protected` — Ejemplo de ruta protegida.

## Dependencias principales
- **Backend:** fastapi, uvicorn, sqlalchemy, pydantic, mysqlclient, python-dotenv, python-jose, passlib
- **Frontend:** react, axios

## Notas
- Agrega nuevos componentes en `/frontend/src/components`.
- Agrega nuevos endpoints en `/backend/app/routes.py`.
- El frontend consume la API en `http://localhost:8000`.

