# schemas.py
# Esquemas para validación y serialización


# Esquemas de validación y serialización para la base clínica
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, time

# Usuario
class UsuarioBase(BaseModel):
    nombre: str
    apellidos: str
    correo_electronico: EmailStr
    profesion: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    contrasena: str
    usuario_id: Optional[int] = None

class Usuario(UsuarioBase):
    id: int
    created_at: datetime
    usuario_id: Optional[int] = None
    class Config:
        orm_mode = True

# Doctor
class DoctorBase(BaseModel):
    nombre: str
    apellidos: str
    consultorio: Optional[str] = None
    profesion: Optional[str] = None
    telefono_celular: Optional[str] = None
    correo_electronico: Optional[str] = None

class DoctorCreate(DoctorBase):
    pass

class Doctor(DoctorBase):
    id: int
    class Config:
        orm_mode = True

# Paciente
class PacienteBase(BaseModel):
    nombre: str
    apellidos: str
    genero: Optional[str] = None
    edad: Optional[int] = None
    its: Optional[bool] = False
    problemas_cardíacos: Optional[bool] = False
    diabetes: Optional[bool] = False
    telefono: Optional[str] = None
    correo_electronico: Optional[str] = None
    fecha_nacimiento: Optional[datetime] = None

class PacienteCreate(PacienteBase):
    pass

class Paciente(PacienteBase):
    id: int
    class Config:
        orm_mode = True

# Historial Clínico
class HistorialClinicoBase(BaseModel):
    medicamento: Optional[str] = None
    tratamiento: Optional[str] = None
    diagnostico: Optional[str] = None
    notas: Optional[str] = None

class HistorialClinicoCreate(HistorialClinicoBase):
    paciente_id: int
    doctor_id: Optional[int] = None  # Esto ya está bien

class HistorialClinicoUpdate(HistorialClinicoBase):
    pass

class HistorialClinico(HistorialClinicoBase):
    id: int
    paciente_id: int
    doctor_id: Optional[int] = None

    class Config:
        orm_mode = True
        from_attributes = True

# Cita
class CitaBase(BaseModel):
    fecha_cita: Optional[datetime] = None
    doctor_id: int
    paciente_id: int
    consultorio_id: int
    telefono: Optional[str] = None
    detalle_cita: Optional[str] = None
    correo_electronico: Optional[str] = None

class CitaCreate(CitaBase):
    pass

class Cita(CitaBase):
    id: int
    class Config:
        orm_mode = True

# Consultorio
class ConsultorioBase(BaseModel):
    nombre_consultorio: Optional[str] = None
    capacidad_doctores: Optional[int] = None
    horario: Optional[time] = None
    numero_contacto: Optional[str] = None

class ConsultorioCreate(ConsultorioBase):
    pass

class Consultorio(ConsultorioBase):
    id: int
    class Config:
        orm_mode = True

# DoctorConsultorio
class DoctorConsultorioBase(BaseModel):
    consultorio_id: int
    doctor_id: int

class DoctorConsultorioCreate(DoctorConsultorioBase):
    pass

class DoctorConsultorio(DoctorConsultorioBase):
    id: int
    class Config:
        orm_mode = True
