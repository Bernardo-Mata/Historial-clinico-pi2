"""
Rutas para el envío de correos electrónicos
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime
from .email_service import enviar_correo_confirmacion_cita
import logging

router = APIRouter()
logger = logging.getLogger("uvicorn.error")


class EmailCitaRequest(BaseModel):
    destinatario: EmailStr
    nombre_paciente: str
    fecha_cita: datetime
    detalle_cita: str


@router.post("/enviar-confirmacion-cita")
async def enviar_confirmacion_cita(request: EmailCitaRequest):
    """
    Endpoint para enviar correo de confirmación de cita
    """
    try:
        resultado = await enviar_correo_confirmacion_cita(
            destinatario=request.destinatario,
            nombre_paciente=request.nombre_paciente,
            fecha_cita=request.fecha_cita,
            detalle_cita=request.detalle_cita
        )
        
        if resultado:
            return {
                "success": True,
                "message": "Correo enviado exitosamente",
                "destinatario": request.destinatario
            }
        else:
            return {
                "success": False,
                "message": "No se pudo enviar el correo. Verifique la configuración SMTP.",
                "destinatario": request.destinatario
            }
            
    except Exception as e:
        logger.error(f"Error en endpoint de correo: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al enviar correo: {str(e)}"
        )
