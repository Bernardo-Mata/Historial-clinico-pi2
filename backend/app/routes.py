# routes.py
# Endpoints de la API

# Endpoints de la API para historial clínico
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, schemas, models
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

router = APIRouter()

# Dependencia para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# Endpoints Usuario
@router.post("/usuarios", response_model=schemas.Usuario)
def create_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return crud.create_usuario(db, usuario)

@router.get("/usuarios", response_model=list[schemas.Usuario])
def read_usuarios(db: Session = Depends(get_db)):
    return crud.get_usuarios(db)

# Endpoint de Registro (alias para crear usuario)
@router.post("/register")
def register_user(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    try:
        new_user = crud.create_usuario(db, usuario)
        return {"message": "Usuario registrado exitosamente", "user": new_user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoints Doctor
@router.post("/doctores", response_model=schemas.Doctor)
def create_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    return crud.create_doctor(db, doctor)

@router.get("/doctores", response_model=list[schemas.Doctor])
def read_doctores(db: Session = Depends(get_db)):
    return crud.get_doctores(db)

# Endpoints Paciente
@router.post("/pacientes", response_model=schemas.Paciente)
def create_paciente(paciente: schemas.PacienteCreate, db: Session = Depends(get_db)):
    return crud.create_paciente(db, paciente)

@router.get("/pacientes", response_model=list[schemas.Paciente])
def read_pacientes(db: Session = Depends(get_db)):
    return crud.get_pacientes(db)

# Endpoints Historial Clínico
@router.post("/historiales", response_model=schemas.HistorialClinico)
def create_historial(historial: schemas.HistorialClinicoCreate, db: Session = Depends(get_db)):
    return crud.create_historial(db, historial)

@router.get("/historiales", response_model=list[schemas.HistorialClinico])
def read_historiales(db: Session = Depends(get_db)):
    return crud.get_historiales(db)

@router.get("/historiales/{historial_id}", response_model=schemas.HistorialClinico)
def get_historial(historial_id: int, db: Session = Depends(get_db)):
    historial = crud.get_historial(db, historial_id)
    if not historial:
        raise HTTPException(status_code=404, detail="Historial no encontrado")
    return historial

@router.put("/historiales/{historial_id}", response_model=schemas.HistorialClinico)
def update_historial(historial_id: int, historial_update: schemas.HistorialClinicoCreate, db: Session = Depends(get_db)):
    historial = crud.update_historial(db, historial_id, historial_update)
    if not historial:
        raise HTTPException(status_code=404, detail="Historial no encontrado")
    return historial

@router.delete("/historiales/{historial_id}", response_model=schemas.HistorialClinico)
def delete_historial(historial_id: int, db: Session = Depends(get_db)):
    historial = crud.delete_historial(db, historial_id)
    if not historial:
        raise HTTPException(status_code=404, detail="Historial no encontrado")
    return historial

# Endpoints Cita
@router.post("/citas", response_model=schemas.Cita)
def create_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    return crud.create_cita(db, cita)

@router.get("/citas", response_model=list[schemas.Cita])
def read_citas(db: Session = Depends(get_db)):
    return crud.get_citas(db)

# Endpoints Consultorio
@router.post("/consultorios", response_model=schemas.Consultorio)
def create_consultorio(consultorio: schemas.ConsultorioCreate, db: Session = Depends(get_db)):
    return crud.create_consultorio(db, consultorio)

@router.get("/consultorios", response_model=list[schemas.Consultorio])
def read_consultorios(db: Session = Depends(get_db)):
    return crud.get_consultorios(db)

# Endpoints DoctorConsultorio
@router.post("/doctor_consultorios", response_model=schemas.DoctorConsultorio)
def create_doctor_consultorio(dc: schemas.DoctorConsultorioCreate, db: Session = Depends(get_db)):
    return crud.create_doctor_consultorio(db, dc)

@router.get("/doctor_consultorios", response_model=list[schemas.DoctorConsultorio])
def read_doctor_consultorios(db: Session = Depends(get_db)):
    return crud.get_doctor_consultorios(db)
