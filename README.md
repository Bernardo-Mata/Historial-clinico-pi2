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
   pip install fastapi uvicorn pydantic
   ```
2. Ejecuta el servidor:
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
- Todas las entradas se validan y sanitizan.
- Los endpoints manejan errores y rechazan datos maliciosos.
- El frontend nunca confía en datos externos.

## Dependencias
- **Backend:** FastAPI, Uvicorn, Pydantic
- **Frontend:** React, Axios

## Notas
- Usa rutas relativas desde la raíz del proyecto.
- El código está listo para producción y sigue las mejores prácticas.
- Para ampliar la funcionalidad, crea nuevos componentes en `/frontend/src/components` y nuevos endpoints en `/backend/app/routes.py`.
