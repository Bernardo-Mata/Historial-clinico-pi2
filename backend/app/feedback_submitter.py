# feedback_submitter.py
"""
Módulo para recibir y guardar feedback de pacientes en la base de datos.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Feedback, Base
import datetime
import os

# Configuración de la base de datos (ajusta la URL según tu entorno)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Función para guardar feedback
def guardar_feedback(
    paciente_id: int,
    nivel_dolor: int,
    control_medicacion: str,
    sangrado: str,
    inflamacion: str,
    fiebre: bool,
    dificultad_tragar: bool,
    mal_sabor: bool,
    entumecimiento: bool,
    doctor_id: int = None
):
    session = SessionLocal()
    try:
        feedback = Feedback(
            paciente_id=paciente_id,
            nivel_dolor=nivel_dolor,
            control_medicacion=control_medicacion,
            sangrado=sangrado,
            inflamacion=inflamacion,
            fiebre=fiebre,
            dificultad_tragar=dificultad_tragar,
            mal_sabor=mal_sabor,
            entumecimiento=entumecimiento,
            fecha_registro=datetime.datetime.utcnow(),
            doctor_id=doctor_id
        )
        session.add(feedback)
        session.commit()
        session.refresh(feedback)
        return feedback
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

# Ejemplo de uso directo (elimina o comenta esto en producción)
if __name__ == "__main__":
    # Prueba de guardado
    nuevo_feedback = guardar_feedback(
        paciente_id=1,
        nivel_dolor=5,
        control_medicacion="Sí",
        sangrado="Nulo",
        inflamacion="Normal",
        fiebre=False,
        dificultad_tragar=False,
        mal_sabor=False,
        entumecimiento=False
    )
    print(f"Feedback guardado con ID: {nuevo_feedback.id}")
