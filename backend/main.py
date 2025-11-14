from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Usuario
from app.utils import verify_password, create_access_token, decode_access_token, SECRET_KEY, ALGORITHM
from app.routes import router as api_router
from app.routes_ia import router as ia_router
from app.routes_email import router as email_router
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import RegisterData
from passlib.context import CryptContext

app = FastAPI(title="Proyecto API")
app.include_router(api_router)
app.include_router(ia_router, prefix="/ia", tags=["ia"])
app.include_router(email_router, prefix="/email", tags=["email"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O especifica ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="No autorizado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    user = db.query(Usuario).filter(Usuario.correo_electronico == email).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.correo_electronico == form_data.username).first()
    if not user or not verify_password(form_data.password, user.contrasena):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    access_token = create_access_token(data={"sub": user.correo_electronico})
    return {"access_token": access_token, "token_type": "bearer"}


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
@app.post("/register")
def register(data: RegisterData, db: Session = Depends(get_db)):
    # Verificar si ya existe
    existing = db.query(Usuario).filter(Usuario.correo_electronico == data.correo_electronico).first()
    if existing:
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    # Hashear password
    hashed = pwd_context.hash(data.contrasena)

    # Crear usuario
    nuevo = Usuario(
        nombre=data.nombre,
        apellidos=data.apellidos,
        correo_electronico=data.correo_electronico,
        contrasena=hashed
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return {"message": "Usuario creado", "id": nuevo.id, "correo": nuevo.correo_electronico}


@app.post("/logout")
def logout(current_user: Usuario = Depends(get_current_user)):
    """
    Endpoint de logout. En una implementación con JWT, el logout se maneja 
    principalmente en el cliente eliminando el token. Este endpoint confirma 
    que el usuario está autenticado antes de hacer logout.
    """
    return {"message": f"Sesión cerrada exitosamente para {current_user.nombre}"}


@app.get("/protected")
def protected_route(current_user: Usuario = Depends(get_current_user)):
    return {"message": f"Hola, {current_user.nombre}. Estás autenticado."}

# Middleware y configuración de seguridad pueden agregarse aquí

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", port=8000, reload=True)
