from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import logging
import httpx
import re
from sqlalchemy.orm import Session
from .database import get_db
from . import crud, models, schemas

router = APIRouter()
logger = logging.getLogger("uvicorn.error")


class AnalisisRequest(BaseModel):
    paciente_id: Optional[int] = None
    consulta_id: Optional[int] = None
    diagnostico: str
    historiales: Optional[List[dict]] = None


@router.post("/analyze")
async def analyze(req: AnalisisRequest):
    """
    Analiza un diagnóstico dental con IA usando OpenRouter.
    Devuelve JSON con resumen, recomendaciones y riesgos.
    """
    diagnostico = (req.diagnostico or "").strip()
    
    if not diagnostico:
        raise HTTPException(status_code=400, detail="El diagnóstico no puede estar vacío")
    
    # Obtener API key
    api_key = os.getenv("API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API_KEY no configurada")
    
    # Modelo gratuito recomendado
    model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.2-3b-instruct:free")
    
    # Construir prompt simple
    prompt = f"""Eres un asistente dental. Analiza el diagnóstico y responde SOLO con JSON válido.
    
    Diagnóstico: {diagnostico}
    
    Formato de respuesta (copia y completa EXACTAMENTE):
    {{"resumen": "tu análisis aquí", "recomendaciones": ["rec1", "rec2", "rec3"], "riesgos": ["riesgo1", "riesgo2"]}}"""
    
    # Llamar a OpenRouter usando el código oficial
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
        
        # Extraer contenido
        try:
            content = data["choices"][0]["message"]["content"].strip()
        except (KeyError, IndexError) as e:
            logger.error("Estructura inesperada de OpenRouter: %s", data)
            raise HTTPException(status_code=502, detail="Respuesta inválida de OpenRouter")
        
        if not content:
            raise HTTPException(status_code=502, detail="OpenRouter devolvió respuesta vacía")
        
        # Limpiar el contenido antes de parsear
        # Extraer solo el JSON válido usando regex
        json_match = re.search(r'\{[\s\S]*\}', content)
        if json_match:
            content = json_match.group(0)
        
        # Limpiar caracteres problemáticos
        content = content.strip()
        
        # Parsear JSON del contenido
        try:
            resultado = json.loads(content)
            
            # Validar estructura básica
            if not isinstance(resultado.get("resumen"), str):
                resultado["resumen"] = content[:200]
            if not isinstance(resultado.get("recomendaciones"), list):
                resultado["recomendaciones"] = []
            if not isinstance(resultado.get("riesgos"), list):
                resultado["riesgos"] = []
            
            return resultado
            
        except json.JSONDecodeError:
            logger.error("Content no es JSON válido después de limpieza: %s", content[:500])
            # Fallback: devolver contenido como resumen
            return {
                "resumen": content,
                "recomendaciones": ["Revisar análisis manual"],
                "riesgos": []
            }
    
    except httpx.HTTPStatusError as e:
        logger.error("OpenRouter HTTP error: %s - %s", e.response.status_code, e.response.text)
        raise HTTPException(status_code=502, detail=f"Error de OpenRouter: {e.response.status_code}")
    except httpx.RequestError as e:
        logger.error("Error de conexión con OpenRouter: %s", e)
        raise HTTPException(status_code=502, detail="No se pudo conectar con OpenRouter")
    except Exception as e:
        logger.exception("Error inesperado: %s", e)
        raise HTTPException(status_code=500, detail="Error interno del servidor")


class GuardarAnalisisRequest(BaseModel):
    consulta_id: int
    resumen: str
    recomendaciones: List[str]
    riesgos: List[str]


@router.post("/guardar-analisis")
async def guardar_analisis(req: GuardarAnalisisRequest, db: Session = Depends(get_db)):
    """
    Guarda el análisis de IA en la base de datos asociado a una consulta.
    """
    try:
        consulta = db.query(models.HistorialClinico).filter(
            models.HistorialClinico.id == req.consulta_id
        ).first()
        
        if not consulta:
            raise HTTPException(status_code=404, detail="Consulta no encontrada")   
        
        # Guardar análisis como JSON en un campo nuevo o actualizar campos existentes
        # Opción 1: Si tienes campo 'analisis_ia' en el modelo (JSON)
        consulta.analisis_ia = {
            "resumen": req.resumen,
            "recomendaciones": req.recomendaciones,
            "riesgos": req.riesgos
        }
        
        db.commit()
        return {"message": "Análisis guardado exitosamente"}
        
    except Exception as e:
        logger.exception("Error guardando análisis: %s", e)
        raise HTTPException(status_code=500, detail="Error guardando análisis")


@router.get("/obtener-analisis/{consulta_id}")
async def obtener_analisis(consulta_id: int, db: Session = Depends(get_db)):
    """
    Obtiene el análisis de IA guardado para una consulta específica.
    """
    try:
        consulta = db.query(models.HistorialClinico).filter(
            models.HistorialClinico.id == consulta_id
        ).first()
        
        if not consulta:
            raise HTTPException(status_code=404, detail="Consulta no encontrada")
        
        # Si no hay análisis guardado, devolver null
        if not hasattr(consulta, 'analisis_ia') or not consulta.analisis_ia:
            return None
        
        return consulta.analisis_ia
        
    except Exception as e:
        logger.exception("Error obteniendo análisis: %s", e)
        raise HTTPException(status_code=500, detail="Error obteniendo análisis")