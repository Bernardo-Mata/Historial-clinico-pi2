"""
Servicio de envío de correos electrónicos
"""
import os
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import aiosmtplib

logger = logging.getLogger("uvicorn.error")

async def enviar_correo_confirmacion_cita(
    destinatario: str,
    nombre_paciente: str,
    fecha_cita: str,
    hora_cita: str,
    motivo: str = "Consulta dental"
):
    """
    Envía un correo de confirmación de cita
    """
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("FROM_EMAIL")

    # Validar configuración
    if not all([smtp_server, smtp_user, smtp_password, from_email]):
        logger.error("Configuración de correo incompleta")
        raise ValueError("Configuración de correo incompleta en variables de entorno")
    
    logger.info(f"Intentando enviar correo a {destinatario}")
    logger.info(f"SMTP Server: {smtp_server}:{smtp_port}")
    logger.info(f"SMTP User: {smtp_user}")

    # Crear mensaje
    mensaje = MIMEMultipart("alternative")
    mensaje["Subject"] = f"Confirmación de Cita - {fecha_cita}"
    mensaje["From"] = from_email
    mensaje["To"] = destinatario

    # Cuerpo del correo en texto plano
    texto_plano = f"""Estimado/a {nombre_paciente},

Su cita ha sido confirmada para el día {fecha_cita} a las {hora_cita}.
Motivo: {motivo}

Por favor, llegue 10 minutos antes de su cita.

Saludos,
Clínica Dental
"""

    # Cuerpo del correo en HTML
    html = f"""
    <html>
      <head>
        <style>
          body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
          .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
          .header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
          .content {{ background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }}
          .cita-info {{ background-color: white; padding: 20px; border-left: 4px solid #4F46E5; margin: 20px 0; }}
          .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #666; }}
          h1 {{ margin: 0; }}
          .highlight {{ color: #4F46E5; font-weight: bold; }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🦷 Confirmación de Cita</h1>
          </div>
          <div class="content">
            <p>Estimado/a <strong>{nombre_paciente}</strong>,</p>
            
            <p>Su cita ha sido confirmada exitosamente. A continuación los detalles:</p>
            
            <div class="cita-info">
              <p><strong>📅 Fecha:</strong> <span class="highlight">{fecha_cita}</span></p>
              <p><strong>🕐 Hora:</strong> <span class="highlight">{hora_cita}</span></p>
              <p><strong>📋 Motivo:</strong> {motivo}</p>
            </div>
            
            <p><strong>Recomendaciones:</strong></p>
            <ul>
              <li>Por favor, llegue <strong>10 minutos antes</strong> de su cita</li>
              <li>Traiga su identificación y tarjeta de seguro (si aplica)</li>
              <li>Si necesita cancelar, hágalo con al menos 24 horas de anticipación</li>
            </ul>
            
            <div class="footer">
              <p>Clínica Dental | Cuidando tu sonrisa</p>
            </div>
          </div>
        </div>
      </body>
    </html>
    """

    # Adjuntar ambas versiones
    parte_texto = MIMEText(texto_plano, "plain", "utf-8")
    parte_html = MIMEText(html, "html", "utf-8")
    
    mensaje.attach(parte_texto)
    mensaje.attach(parte_html)

    try:
        # Conectar al servidor SMTP
        logger.info("Conectando al servidor SMTP...")
        smtp = aiosmtplib.SMTP(
            hostname=smtp_server,
            port=smtp_port,
            use_tls=False,  # No usar TLS en la conexión inicial
            start_tls=True   # Pero sí permitir STARTTLS después
        )
        
        await smtp.connect()
        logger.info("Conexión establecida")
        
        # STARTTLS se maneja automáticamente con start_tls=True
        logger.info("Iniciando STARTTLS...")
        
        await smtp.login(smtp_user, smtp_password)
        logger.info("Login exitoso")
        
        await smtp.send_message(mensaje)
        logger.info(f"Correo enviado exitosamente a {destinatario}")
        
        await smtp.quit()
        logger.info("Conexión cerrada")
        
        return True
        
    except Exception as e:
        logger.error(f"Error al enviar correo: {str(e)}")
        logger.exception("Traceback completo:")
        raise
