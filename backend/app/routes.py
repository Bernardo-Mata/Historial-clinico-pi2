# routes.py
# Endpoints de la API

# Endpoints de la API para historial clínico
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import crud, schemas, models
from .database import get_db
from .utils import verify_password, create_access_token
from .email_service import enviar_correo_confirmacion_cita
import logging

router = APIRouter()
logger = logging.getLogger("uvicorn.error")

# Endpoints Usuario
@router.post("/usuarios", response_model=schemas.Usuario)
def create_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    return crud.create_usuario(db, usuario)

@router.get("/usuarios", response_model=list[schemas.Usuario])
def read_usuarios(db: Session = Depends(get_db)):
    return crud.get_usuarios(db)

# ==================== DOCTORES ====================
@router.post("/doctores", response_model=schemas.Doctor)
def create_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    return crud.create_doctor(db, doctor)

@router.get("/doctores", response_model=list[schemas.Doctor])
def read_doctores(db: Session = Depends(get_db)):
    return crud.get_doctores(db)

# ==================== PACIENTES ====================
@router.post("/pacientes", response_model=schemas.Paciente)
def create_paciente(paciente: schemas.PacienteCreate, db: Session = Depends(get_db)):
    return crud.create_paciente(db, paciente)

@router.get("/pacientes", response_model=list[schemas.Paciente])
def read_pacientes(db: Session = Depends(get_db)):
    return crud.get_pacientes(db)

@router.get("/pacientes/{paciente_id}", response_model=schemas.Paciente)
def read_paciente(paciente_id: int, db: Session = Depends(get_db)):
    paciente = crud.get_paciente(db, paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return paciente

@router.put("/pacientes/{paciente_id}", response_model=schemas.Paciente)
def update_paciente(paciente_id: int, paciente: schemas.PacienteCreate, db: Session = Depends(get_db)):
    updated_paciente = crud.update_paciente(db, paciente_id, paciente)
    if not updated_paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return updated_paciente

@router.delete("/pacientes/{paciente_id}")
def delete_paciente(paciente_id: int, db: Session = Depends(get_db)):
    deleted_paciente = crud.delete_paciente(db, paciente_id)
    if not deleted_paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return {"message": "Paciente eliminado exitosamente"}

# ==================== HISTORIAL CLÍNICO ====================
@router.post("/historiales", response_model=schemas.HistorialClinico)
def create_historial(historial: schemas.HistorialClinicoCreate, db: Session = Depends(get_db)):
    return crud.create_historial(db, historial)

@router.get("/historiales", response_model=list[schemas.HistorialClinico])
def read_historiales(db: Session = Depends(get_db)):
    return crud.get_historiales(db)

@router.get("/historiales/paciente/{paciente_id}", response_model=list[schemas.HistorialClinico])
def read_historiales_paciente(paciente_id: int, db: Session = Depends(get_db)):
    """Obtiene todos los historiales clínicos de un paciente específico"""
    paciente = crud.get_paciente(db, paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return crud.get_historiales_by_paciente(db, paciente_id)

@router.get("/historiales/{historial_id}", response_model=schemas.HistorialClinico)
def read_historial(historial_id: int, db: Session = Depends(get_db)):
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

# ==================== CITAS ====================
@router.post("/citas", response_model=schemas.Cita)
async def create_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    # Crear la cita
    nueva_cita = crud.create_cita(db, cita)
    
    # Enviar correo de confirmación si hay email
    if cita.correo_electronico:
        try:
            # Obtener información del paciente
            paciente = crud.get_paciente(db, cita.paciente_id)
            if paciente:
                nombre_completo = f"{paciente.nombre} {paciente.apellidos}"
                
                # Extraer hora de fecha_cita si es datetime, o usar un valor por defecto
                fecha_str = str(cita.fecha_cita)
                hora_str = "Por confirmar"
                
                # Si fecha_cita incluye hora (formato: "YYYY-MM-DD HH:MM:SS")
                if " " in fecha_str:
                    partes = fecha_str.split(" ")
                    fecha_str = partes[0]
                    hora_str = partes[1][:5] if len(partes) > 1 else hora_str
                
                # Enviar correo de forma asíncrona
                await enviar_correo_confirmacion_cita(
                    destinatario=cita.correo_electronico,
                    nombre_paciente=nombre_completo,
                    fecha_cita=fecha_str,
                    hora_cita=hora_str,
                    motivo=cita.detalle_cita or "Consulta general"
                )
                logger.info(f"Correo de confirmación enviado a {cita.correo_electronico}")
        except Exception as e:
            # No fallar la creación de la cita si falla el correo
            logger.warning(f"No se pudo enviar correo de confirmación: {e}")
    
    return nueva_cita

@router.get("/citas", response_model=list[schemas.Cita])
def read_citas(db: Session = Depends(get_db)):
    return crud.get_citas(db)

@router.delete("/citas/{cita_id}")
def delete_cita(cita_id: int, db: Session = Depends(get_db)):
    """Eliminar una cita por ID"""
    cita = db.query(models.Cita).filter(models.Cita.id == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(cita)
    db.commit()
    return {"message": "Cita eliminada exitosamente"}

# ==================== CONSULTORIOS ====================
@router.post("/consultorios", response_model=schemas.Consultorio)
def create_consultorio(consultorio: schemas.ConsultorioCreate, db: Session = Depends(get_db)):
    return crud.create_consultorio(db, consultorio)

@router.get("/consultorios", response_model=list[schemas.Consultorio])
def read_consultorios(db: Session = Depends(get_db)):
    return crud.get_consultorios(db)

# ==================== DOCTOR CONSULTORIO ====================
@router.post("/doctor_consultorios", response_model=schemas.DoctorConsultorio)
def create_doctor_consultorio(dc: schemas.DoctorConsultorioCreate, db: Session = Depends(get_db)):
    return crud.create_doctor_consultorio(db, dc)

@router.get("/doctor_consultorios", response_model=list[schemas.DoctorConsultorio])
def read_doctor_consultorios(db: Session = Depends(get_db)):
    return crud.get_doctor_consultorios(db)
