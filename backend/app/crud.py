# crud.py

# Operaciones CRUD seguras para todos los modelos
from fastapi import  HTTPException
from sqlalchemy.orm import Session
from . import models, schemas
from .utils import get_password_hash
# Usuario
# Usuario
def create_usuario(db: Session, usuario: schemas.UsuarioCreate):
    """
    Crea un usuario con la contraseña hasheada.
    Si la profesión no es 'paciente' (case-insensitive) también crea un registro en `doctor`.
    """
    existing = db.query(models.Usuario).filter(models.Usuario.correo_electronico == usuario.correo_electronico).first()
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    usr_data = usuario.dict()
    usr_data['contrasena'] = get_password_hash(usr_data['contrasena'])
    db_usuario = models.Usuario(**usr_data)
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)

    # Registrar como doctor si la profesion no es 'paciente'
    profesion = (db_usuario.profesion or "").strip().lower()
    if profesion and profesion != "paciente":
        existing_doc = db.query(models.Doctor).filter(models.Doctor.correo_electronico == db_usuario.correo_electronico).first()
        if not existing_doc:
            doctor = models.Doctor(
                nombre=db_usuario.nombre,
                apellidos=db_usuario.apellidos,
                consultorio=None,
                profesion=db_usuario.profesion,
                telefono_celular=None,
                correo_electronico=db_usuario.correo_electronico
            )
            db.add(doctor)
            db.commit()
            db.refresh(doctor)

    return db_usuario

def get_usuarios(db: Session):
    return db.query(models.Usuario).all()

# Doctor
def create_doctor(db: Session, doctor: schemas.DoctorCreate):
    db_doctor = models.Doctor(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

def get_doctores(db: Session):
    return db.query(models.Doctor).all()

# Paciente
def create_paciente(db: Session, paciente: schemas.PacienteCreate):
    db_paciente = models.Paciente(**paciente.dict())
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

def get_pacientes(db: Session):
    return db.query(models.Paciente).all()

# Historial Clínico
def create_historial(db: Session, historial: schemas.HistorialClinicoCreate):
    db_historial = models.HistorialClinico(**historial.dict())
    db.add(db_historial)
    db.commit()
    db.refresh(db_historial)
    return db_historial

def get_historiales(db: Session):
    return db.query(models.HistorialClinico).all()

def get_historial(db: Session, historial_id: int):
    return db.query(models.HistorialClinico).filter(models.HistorialClinico.id == historial_id).first()

def update_historial(db: Session, historial_id: int, historial_update: schemas.HistorialClinicoCreate):
    historial = get_historial(db, historial_id)
    if historial:
        for key, value in historial_update.dict().items():
            setattr(historial, key, value)
        db.commit()
        db.refresh(historial)
    return historial

def delete_historial(db: Session, historial_id: int):
    historial = get_historial(db, historial_id)
    if historial:
        db.delete(historial)
        db.commit()
    return historial

# Cita
def create_cita(db: Session, cita: schemas.CitaCreate):
    db_cita = models.Cita(**cita.dict())
    db.add(db_cita)
    db.commit()
    db.refresh(db_cita)
    return db_cita

def get_citas(db: Session):
    return db.query(models.Cita).all()

# Consultorio
def create_consultorio(db: Session, consultorio: schemas.ConsultorioCreate):
    db_consultorio = models.Consultorio(**consultorio.dict())
    db.add(db_consultorio)
    db.commit()
    db.refresh(db_consultorio)
    return db_consultorio

def get_consultorios(db: Session):
    return db.query(models.Consultorio).all()

# DoctorConsultorio
def create_doctor_consultorio(db: Session, dc: schemas.DoctorConsultorioCreate):
    db_dc = models.DoctorConsultorio(**dc.dict())
    db.add(db_dc)
    db.commit()
    db.refresh(db_dc)
    return db_dc

def get_doctor_consultorios(db: Session):
    return db.query(models.DoctorConsultorio).all()
