# main.py
# Punto de entrada de la API FastAPI
from fastapi import FastAPI
from app.routes import router

app = FastAPI()

# Incluye las rutas definidas en app/routes.py
app.include_router(router)

# Middleware y configuración de seguridad pueden agregarse aquí

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
