# models.py
# Modelos de datos para la aplicación


# Modelos de datos para la base de datos clínica
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Time
from sqlalchemy.orm import relationship
from .database import Base
import datetime

# Usuario
class Usuario(Base):
    __tablename__ = "usuario"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellidos = Column(String, nullable=False)
    correo_electronico = Column(String, unique=True, index=True, nullable=False)
    profesion = Column(String)
    contrasena = Column(String, nullable=False)  # Guardar el hash, no la contraseña en texto plano
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    usuario_id = Column(Integer, unique=True)

# Doctor
class Doctor(Base):
    __tablename__ = "doctor"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellidos = Column(String, nullable=False)
    consultorio = Column(String)
    profesion = Column(String)
    telefono_celular = Column(String)
    correo_electronico = Column(String)
    historiales = relationship("HistorialClinico", back_populates="doctor")
    citas = relationship("Cita", back_populates="doctor")
    doctor_consultorios = relationship("DoctorConsultorio", back_populates="doctor")

# Paciente
class Paciente(Base):
    __tablename__ = "paciente"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellidos = Column(String, nullable=False)
    genero = Column(String)
    edad = Column(Integer)
    its = Column(Boolean, default=False)
    problemas_cardíacos = Column(Boolean, default=False)
    diabetes = Column(Boolean, default=False)
    telefono = Column(String)
    correo_electronico = Column(String)
    fecha_nacimiento = Column(DateTime)
    historiales = relationship("HistorialClinico", back_populates="paciente")
    citas = relationship("Cita", back_populates="paciente")

# Historial Clínico
class HistorialClinico(Base):
    __tablename__ = "historial_clinico"
    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("paciente.id"))
    doctor_id = Column(Integer, ForeignKey("doctor.id"))
    medicamento = Column(Text)
    tratamiento = Column(Text)
    diagnostico = Column(Text)
    notas = Column(Text)
    paciente = relationship("Paciente", back_populates="historiales")
    doctor = relationship("Doctor", back_populates="historiales")

# Cita
class Cita(Base):
    __tablename__ = "cita"
    id = Column(Integer, primary_key=True, index=True)
    fecha_cita = Column(DateTime)
    doctor_id = Column(Integer, ForeignKey("doctor.id"))
    paciente_id = Column(Integer, ForeignKey("paciente.id"))
    consultorio_id = Column(Integer, ForeignKey("consultorio.id"))
    telefono = Column(String)
    detalle_cita = Column(Text)
    correo_electronico = Column(String)
    paciente = relationship("Paciente", back_populates="citas")
    doctor = relationship("Doctor", back_populates="citas")
    consultorio = relationship("Consultorio", back_populates="citas")

# Consultorio
class Consultorio(Base):
    __tablename__ = "consultorio"
    id = Column(Integer, primary_key=True, index=True)
    nombre_consultorio = Column(String)
    capacidad_doctores = Column(Integer)
    horario = Column(Time)
    numero_contacto = Column(String)
    citas = relationship("Cita", back_populates="consultorio")
    doctor_consultorios = relationship("DoctorConsultorio", back_populates="consultorio")

# DoctorConsultorio
class DoctorConsultorio(Base):
    __tablename__ = "doctor_consultorio"
    id = Column(Integer, primary_key=True, index=True)
    consultorio_id = Column(Integer, ForeignKey("consultorio.id"))
    doctor_id = Column(Integer, ForeignKey("doctor.id"))
    consultorio = relationship("Consultorio", back_populates="doctor_consultorios")
    doctor = relationship("Doctor", back_populates="doctor_consultorios")
