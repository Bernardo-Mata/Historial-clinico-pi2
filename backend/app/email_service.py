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


def generar_mensaje_seguimiento_rutinario(
    destinatario: str,
    nombre_paciente: str,
    procedimiento: str,
    etapa: str
) -> MIMEMultipart:
    """
    Devuelve un objeto MIMEMultipart listo para enviar vía Gmail.

    - `etapa` ejemplos: "2_hours", "3_days", o texto libre para personalizar.
    """
    etapa_map = {
        "2_hours": ("Recordatorio: Evita alimentos oscuros", 
                    "Recomendación: Evite alimentos y bebidas que manchen durante las próximas 24 horas."),
        "3_days": ("Recordatorio: Sensibilidad normal tras el tratamiento",
                   "Nota: Es normal experimentar algo de sensibilidad hasta 3-5 días. Use analgesia según indicación."),
    }
    subject_extra, body_extra = etapa_map.get(etapa, (f"Seguimiento: {etapa}", ""))

    mensaje = MIMEMultipart("alternative")
    mensaje["Subject"] = f"{subject_extra} — {procedimiento}"
    mensaje["To"] = destinatario

    texto = f"""Estimado/a {nombre_paciente},

Este es un mensaje automático de seguimiento tras su procedimiento: {procedimiento}.

{body_extra}

Si observa algo inusual (sangrado persistente, dolor intenso o fiebre), contacte con la clínica.

Atentamente,
Clínica Dental
"""
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color:#333;">
        <div style="max-width:600px;margin:0 auto;padding:16px;">
          <h2 style="color:#4F46E5;margin:0 0 8px 0;">{subject_extra}</h2>
          <p>Estimado/a <strong>{nombre_paciente}</strong>,</p>
          <p>Este mensaje es un recordatorio automático tras su procedimiento: <strong>{procedimiento}</strong>.</p>
          <div style="background:#fff;padding:12px;border-left:4px solid #4F46E5;margin:12px 0;">
            <p style="margin:0;">{body_extra}</p>
          </div>
          <p style="margin-top:12px;">Si observa algo inusual (sangrado persistente, dolor intenso o fiebre), contacte con la clínica.</p>
          <p style="color:#666;font-size:12px;margin-top:20px;">Clínica Dental | Cuidando tu sonrisa</p>
        </div>
      </body>
    </html>
    """

    parte_texto = MIMEText(texto, "plain", "utf-8")
    parte_html = MIMEText(html, "html", "utf-8")
    mensaje.attach(parte_texto)
    mensaje.attach(parte_html)
    return mensaje


async def enviar_mensaje(mensaje: MIMEMultipart) -> bool:
    """
    Envia un objeto MIMEMultipart usando la configuración SMTP de entorno.
    Retorna True si se envi� correctamente, lanza excepción en caso contrario.
    """
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("FROM_EMAIL")

    if not all([smtp_server, smtp_user, smtp_password, from_email]):
      logger.error("Configuración de correo incompleta (en enviar_mensaje)")
      raise ValueError("Configuración de correo incompleta en variables de entorno")

    # Asegurar que exista el campo From
    if not mensaje.get("From"):
      mensaje["From"] = from_email

    try:
      smtp = aiosmtplib.SMTP(
        hostname=smtp_server,
        port=smtp_port,
        use_tls=False,
        start_tls=True,
      )
      await smtp.connect()
      await smtp.login(smtp_user, smtp_password)
      await smtp.send_message(mensaje)
      await smtp.quit()
      logger.info(f"Correo enviado a {mensaje.get('To')}")
      return True
    except Exception as e:
      logger.error(f"Error enviando mensaje genérico: {e}")
      logger.exception("Traceback enviar_mensaje:")
      raise


async def enviar_tres_correos_demo(
    destinatario: str,
    nombre_paciente: str,
    fecha_cita: str,
    hora_cita: str,
    motivo: str = "Consulta general",
    procedimiento: str = "Procedimiento",
    formulario_url: str = None,
  ) -> bool:
    """
    Envía tres correos de demostración tras registro/agendamiento:
      1) Confirmación (usa enviar_correo_confirmacion_cita)
      2) Mensaje de seguimiento rutinario (ej. 2_hours)
      3) Solicitud de feedback post-operatorio (ej. 24 horas)

    Nota: en producción estos se programarían para enviarse más tarde; aquí
    se envían inmediatamente para demostrar su existencia.
    """
    # Intentar enviar la confirmación (función existente)
    await enviar_correo_confirmacion_cita(
      destinatario=destinatario,
      nombre_paciente=nombre_paciente,
      fecha_cita=fecha_cita,
      hora_cita=hora_cita,
      motivo=motivo,
    )

    # Enviar mensaje de seguimiento rutinario (2_hours) inmediatamente
    try:
      seguimiento = generar_mensaje_seguimiento_rutinario(
        destinatario=destinatario,
        nombre_paciente=nombre_paciente,
        procedimiento=procedimiento,
        etapa="2_hours",
      )
      await enviar_mensaje(seguimiento)
    except Exception:
      logger.warning("Fallo enviando mensaje de seguimiento rutinario (demo)")

    # Enviar solicitud de feedback postoperatorio (24 horas) inmediatamente
    try:
      formulario_url = formulario_url or os.getenv("FORMULARIO_URL", "https://example.com/formulario")
      feedback = generar_mensaje_postoperatorio_feedback(
        destinatario=destinatario,
        nombre_paciente=nombre_paciente,
        procedimiento=procedimiento,
        horas_postop=24,
        formulario_url=formulario_url,
      )
      await enviar_mensaje(feedback)
    except Exception:
      logger.warning("Fallo enviando mensaje de feedback postoperatorio (demo)")

    return True


def generar_mensaje_postoperatorio_feedback(
    destinatario: str,
    nombre_paciente: str,
    procedimiento: str,
    horas_postop: int,
    formulario_url: str
) -> MIMEMultipart:
    """
    Genera el correo que solicita feedback postoperatorio (escala 1-10).
    - `horas_postop`: 24, 48 o 72 (se inserta en asunto y cuerpo).
    - `formulario_url`: URL al formulario web interactivo.
    """
    mensaje = MIMEMultipart("alternative")
    mensaje["Subject"] = f"Formulario post-operatorio — {procedimiento} — {horas_postop} horas"
    mensaje["To"] = destinatario

    texto = f"""Estimado/a {nombre_paciente},

Por favor complete este breve formulario de seguimiento {horas_postop} horas después de su intervención ({procedimiento}).

En el formulario podrá valorar (1-10) su:
 - Dolor
 - Sangrado
 - Inflamación

Acceda al formulario aquí: {formulario_url}

Su respuesta nos ayuda a detectar y actuar ante complicaciones de forma temprana.

Gracias,
Clínica Dental
"""
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color:#333;">
        <div style="max-width:600px;margin:0 auto;padding:16px;">
          <h2 style="color:#4F46E5;margin:0 0 8px 0;">Seguimiento post-operatorio — {horas_postop} horas</h2>
          <p>Estimado/a <strong>{nombre_paciente}</strong>,</p>
          <p>Le rogamos complete este breve formulario tras su intervención: <strong>{procedimiento}</strong>.</p>
          <ul>
            <li>Valore su dolor (1 = ninguno, 10 = máximo)</li>
            <li>Valore el sangrado (1 = ninguno, 10 = severo)</li>
            <li>Valore la inflamación (1 = mínima, 10 = severa)</li>
          </ul>
          <p style="text-align:center;margin:18px 0;">
            <a href="{formulario_url}" style="background:#4F46E5;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;display:inline-block;">
              Completar formulario
            </a>
          </p>
          <p style="color:#666;font-size:12px;">Su respuesta es confidencial y se usa para seguimiento clínico.</p>
        </div>
      </body>
    </html>
    """

    parte_texto = MIMEText(texto, "plain", "utf-8")
    parte_html = MIMEText(html, "html", "utf-8")
    mensaje.attach(parte_texto)
    mensaje.attach(parte_html)
    return mensaje
