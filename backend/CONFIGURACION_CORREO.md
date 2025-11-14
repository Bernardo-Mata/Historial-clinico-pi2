# Configuración de Correo Electrónico

## Requisitos
El sistema de correos utiliza SMTP para enviar notificaciones de confirmación de citas.

## Configuración

### Opción 1: Gmail (Recomendado)

1. **Crear una Contraseña de Aplicación** (necesario si tienes 2FA activado):
   - Ve a tu cuenta de Google: https://myaccount.google.com/
   - Seguridad → Verificación en dos pasos
   - En la parte inferior, selecciona "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Correo"
   - Copia la contraseña generada

2. **Configurar variables de entorno en `.env`**:
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-correo@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # Contraseña de aplicación
FROM_EMAIL=tu-correo@gmail.com
```

### Opción 2: Otros proveedores

#### Outlook/Hotmail
```env
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=tu-correo@outlook.com
SMTP_PASSWORD=tu-contraseña
FROM_EMAIL=tu-correo@outlook.com
```

#### Yahoo
```env
SMTP_SERVER=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=tu-correo@yahoo.com
SMTP_PASSWORD=contraseña-de-aplicacion
FROM_EMAIL=tu-correo@yahoo.com
```

## Funcionamiento

### Envío Automático
Cuando se crea una cita en el calendario y se proporciona un correo electrónico:
1. El sistema guarda la cita en la base de datos
2. Automáticamente envía un correo de confirmación al paciente
3. El correo incluye:
   - Nombre del paciente
   - Fecha y hora de la cita
   - Motivo/detalle de la consulta
   - Recomendaciones generales

### Endpoint Manual
También puedes enviar correos manualmente usando el endpoint:

```bash
POST http://localhost:8000/email/enviar-confirmacion-cita
Content-Type: application/json

{
  "destinatario": "paciente@ejemplo.com",
  "nombre_paciente": "Juan Pérez",
  "fecha_cita": "2025-11-20T10:30:00",
  "detalle_cita": "Limpieza dental"
}
```

## Instalación de Dependencias

```bash
pip install aiosmtplib email-validator
```

## Solución de Problemas

### Error: "No se pudo enviar el correo"
- Verifica que las credenciales SMTP sean correctas
- Si usas Gmail, asegúrate de usar una contraseña de aplicación
- Verifica que el servidor SMTP y puerto sean correctos

### El correo no falla pero no llega
- Revisa la carpeta de spam del destinatario
- Verifica que el correo del remitente esté configurado correctamente

### Deshabilitar correos temporalmente
Si no quieres configurar correos ahora, simplemente deja vacías las variables `SMTP_USER` y `SMTP_PASSWORD`. El sistema funcionará normalmente pero no enviará correos.

## Logs
Los logs de envío de correos se registran en la consola de uvicorn:
- ✓ Correo enviado: `INFO: Correo enviado exitosamente a destinatario@ejemplo.com`
- ✗ Error: `WARNING: No se pudo enviar correo de confirmación: [error]`
