# Sistema de Gestión Clínica Dental 🦷# Proyecto FastAPI + React



Sistema web completo para la gestión de consultorios dentales, desarrollado con FastAPI (backend) y React + Vite (frontend).## Descripción

Este proyecto implementa una arquitectura moderna y segura basada en FastAPI (Python) para el backend y React.js para el frontend. El objetivo y los requerimientos se basan en el PDF adjunto y el README original, pero reestructurados con las mejores prácticas y tecnologías actuales.

## 📋 Características

## Estructura

- **Autenticación de usuarios** con JWT (JSON Web Tokens)```

- **Registro de doctores y pacientes**/Proyecto

- **Dashboard interactivo** con resumen de citas y pacientes  /backend        # API REST con FastAPI

- **Gestión de consultorios** y especialidades    main.py       # Punto de entrada

- **Historial clínico** de pacientes    /app

- **Calendario de citas**      models.py   # Modelos de datos

      schemas.py  # Validaciones

## 🛠️ Tecnologías      routes.py   # Endpoints

      __init__.py # Inicialización

### Backend  /frontend       # Interfaz React

- **FastAPI** - Framework web moderno y rápido    /src

- **SQLAlchemy** - ORM para base de datos      App.jsx     # Componente principal

- **MySQL** - Base de datos relacional      index.jsx   # Entrada React

- **PyJWT** - Autenticación con tokens JWT      /components

- **Passlib** - Hash seguro de contraseñas con bcrypt        ExampleComponent.jsx # Componente ejemplo

- **Python 3.12**    package.json   # Dependencias frontend

```

### Frontend

- **React 18** - Biblioteca de interfaces de usuario## Instalación

- **Vite** - Build tool y dev server rápido

- **Tailwind CSS 3** - Framework de estilos utility-first### Backend

- **JavaScript (JSX)** - Sin TypeScript1. Instala dependencias:

   ```sh

## 📁 Estructura del Proyecto   pip install -r requirements.txt

   ```

```2. Configura el archivo `.env`:

Proyecto/   ```

├── backend/   MYSQL_USER=tu_usuario

│   ├── app/   MYSQL_PASSWORD=tu_contraseña

│   │   ├── __init__.py   MYSQL_HOST=localhost

│   │   ├── models.py          # Modelos de base de datos   MYSQL_DB=historial_clinico

│   │   ├── schemas.py         # Esquemas Pydantic   ```

│   │   ├── database.py        # Configuración de BD3. Ejecuta el servidor:

│   │   ├── crud.py            # Operaciones CRUD   ```sh

│   │   ├── routes.py          # Rutas de la API   uvicorn main:app --reload

│   │   └── utils.py           # Utilidades (JWT, hash)   ```

│   ├── main.py                # Punto de entrada de la API

│   └── requirements.txt       # Dependencias Python### Frontend

│1. Instala dependencias:

└── frontend/   ```sh

    ├── src/   npm install

    │   ├── components/   ```

    │   │   ├── Login.jsx      # Componente de login2. Ejecuta la app:

    │   │   ├── Register.jsx   # Componente de registro   ```sh

    │   │   └── Dashboard.jsx  # Dashboard principal   npm start

    │   ├── App.jsx            # Componente raíz   ```

    │   ├── main.jsx           # Punto de entrada

    │   └── index.css          # Estilos globales (Tailwind)## Seguridad

    ├── package.json- Contraseñas hasheadas con bcrypt.

    ├── tailwind.config.js- Autenticación con JWT.

    ├── postcss.config.js- Validación de datos con Pydantic.

    └── vite.config.js- CORS habilitado para desarrollo.

```

## Endpoints principales

## 🚀 Instalación y Configuración- `POST /usuarios` — Registro de usuario.

- `POST /login` — Login y obtención de JWT.

### Prerrequisitos- `GET /protected` — Ejemplo de ruta protegida.



- Python 3.12+## Dependencias principales

- Node.js 18+- **Backend:** fastapi, uvicorn, sqlalchemy, pydantic, mysqlclient, python-dotenv, python-jose, passlib

- MySQL 8.0+- **Frontend:** react, axios



### Backend## Notas

- Agrega nuevos componentes en `/frontend/src/components`.

1. **Crear y activar entorno virtual:**- Agrega nuevos endpoints en `/backend/app/routes.py`.

   ```bash- El frontend consume la API en `http://localhost:8000`.

   cd backend

   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar base de datos:**
   - Crear una base de datos MySQL llamada `historial_clinico`
   - Crear archivo `.env` en la raíz del proyecto:
     ```env
     MYSQL_USER=root
     MYSQL_PASSWORD=tu_contraseña
     MYSQL_HOST=localhost
     MYSQL_DB=historial_clinico
     SECRET_KEY=tu_clave_secreta_super_segura
     ```

4. **Crear tablas en la base de datos:**
   ```bash
   cd backend
   python -c "from app.database import Base, engine; import app.models; Base.metadata.create_all(bind=engine); print('Tablas creadas OK')"
   ```

5. **Iniciar el servidor:**
   ```bash
   uvicorn main:app --reload
   ```
   El backend estará disponible en `http://localhost:8000`

### Frontend

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`

## 📊 Modelos de Base de Datos

### Usuario
- `id` (PK)
- `nombre`
- `apellidos`
- `correo_electronico` (único)
- `contrasena` (hasheada)
- `profesion`
- `telefono`
- `cedula`
- `created_at`

### Doctor
- `id` (PK)
- `nombre`
- `apellidos`
- `consultorio`
- `profesion`
- `telefono_celular`
- `correo_electronico` (único)
- `created_at`

### Paciente
- `id_paciente` (PK)
- `nombre`
- `apellido_paterno`
- `apellido_materno`
- `fecha_nacimiento`
- `sexo`
- `telefono_celular`
- `correo_electronico`
- `direccion`

### Consultorio
- `id_consultorio` (PK)
- `nombre_consultorio`
- `direccion`
- `telefono`

### Cita
- `id_cita` (PK)
- `id_paciente` (FK)
- `id_doctor` (FK)
- `id_consultorio` (FK)
- `fecha`
- `hora`
- `motivo`
- `estado`

### Historial Clínico
- `id_historial` (PK)
- `id_paciente` (FK)
- `id_doctor` (FK)
- `fecha`
- `diagnostico`
- `tratamiento`
- `observaciones`

## 🔐 Endpoints de la API

### Autenticación

#### POST `/login`
Inicia sesión y obtiene un token JWT.

**Body (form-data):**
```
username: correo@ejemplo.com
password: contraseña
```

**Respuesta:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

#### POST `/register`
Registra un nuevo usuario. Si la profesión no es "paciente", también se registra como doctor.

**Body:**
```json
{
  "nombre": "Juan",
  "apellidos": "Pérez García",
  "correo_electronico": "juan@ejemplo.com",
  "profesion": "Dentista",
  "telefono": "8112345678",
  "cedula": "12345678",
  "contrasena": "MiPassword123"
}
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "nombre": "Juan",
    "correo_electronico": "juan@ejemplo.com"
  }
}
```

#### POST `/logout`
Cierra sesión del usuario (requiere autenticación).

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "message": "Sesión cerrada exitosamente para Juan"
}
```

### Usuarios

#### GET `/usuarios`
Obtiene lista de todos los usuarios.

#### POST `/usuarios`
Crea un nuevo usuario.

### Doctores

#### GET `/doctores`
Obtiene lista de todos los doctores.

## 🎨 Componentes Frontend

### Login
- Formulario de inicio de sesión
- Validación de credenciales
- Redirección automática al dashboard
- Navegación al registro

### Register
- Formulario de registro completo
- Validación de campos
- Auto-login después del registro
- Navegación de regreso al login

### Dashboard
- Sidebar con navegación
- Resumen de agenda del día
- Detalles de pacientes
- Botón de cierre de sesión
- Diseño responsivo

## 🔧 Configuración de Tailwind CSS

El proyecto usa Tailwind CSS v3 con PostCSS. La configuración está optimizada para detectar clases en todos los archivos JSX:

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🐛 Solución de Problemas

### Error: "Cannot find module 'python-jose'"
**Solución:** Usar PyJWT en lugar de python-jose para compatibilidad con Python 3.12+
```bash
pip uninstall python-jose
pip install PyJWT[crypto] cryptography
```

### Error: Tailwind CSS no se aplica
**Solución:** 
1. Verificar que `index.css` solo contenga las directivas de Tailwind
2. Limpiar caché: `npm cache clean --force`
3. Reinstalar: `npm install -D tailwindcss@^3 postcss autoprefixer`

### Error: CORS en llamadas a la API
**Solución:** El backend ya tiene configurado CORS para permitir todas las origins en desarrollo.

### Error: "Access denied for user 'root'@'localhost'"
**Solución:** Verificar credenciales en el archivo `.env` y asegurarse de que MySQL esté corriendo.

## 📝 Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. Backend valida credenciales contra la base de datos
3. Si es válido, genera un token JWT con el email del usuario
4. Frontend guarda el token en `localStorage`
5. Para rutas protegidas, el frontend envía el token en el header `Authorization: Bearer <token>`
6. Backend valida el token y devuelve los datos solicitados
7. Al hacer logout, se elimina el token y se redirige al login

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (cost factor: 12)
- Tokens JWT con expiración de 30 minutos
- Validación de datos con Pydantic
- CORS configurado (restringir en producción)
- Variables de entorno para credenciales sensibles

## 📄 Licencia

Este proyecto es parte de un proyecto académico del 9° semestre.

## 👥 Autores

- Bernardo Mata - Desarrollo Full Stack

## 🚀 Próximas Características

- [ ] Gestión completa de citas (crear, editar, eliminar)
- [ ] Vista de calendario interactivo
- [ ] Gestión de historial clínico
- [ ] Panel de administración
- [ ] Notificaciones por email
- [ ] Reportes y estadísticas
- [ ] Subida de archivos (rayos X, documentos)

## 📞 Soporte

Para dudas o problemas, contactar al equipo de desarrollo.

---

**Documentación de la API:** `http://localhost:8000/docs` (Swagger UI)

**Documentación alternativa:** `http://localhost:8000/redoc` (ReDoc)
