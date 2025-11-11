from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
import os
import json
import logging
import re

router = APIRouter()
logger = logging.getLogger("uvicorn.error")


class AnalisisRequest(BaseModel):
    paciente_id: Optional[int] = None
    consulta_id: Optional[int] = None
    diagnostico: str
    historiales: Optional[List[dict]] = None


def parse_toon(text: str) -> Dict[str, Any]:
    """
    Intento robusto de convertir una respuesta en 'TOON' a dict.
    Reglas prácticas implementadas:
    - Extrae campos por etiquetas: resumen, recomendaciones, riesgos, estadisticas.
    - Listas aceptan formatos:
        * JSON array: ["a","b"]
        * Líneas con guiones:
            - item1
            - item2
        * Separadas por coma o punto y coma.
    - Estadisticas intenta parsear bloque JSON si está presente.
    """
    out: Dict[str, Any] = {}
    t = text.strip()

    # Normalizar saltos
    t = re.sub(r'\r\n', '\n', t)

    # Campo 'resumen'
    m = re.search(r"resumen\s*[:=]\s*(.+?)(?=\n(?:recomendaciones|riesgos|estadisticas)\s*[:=]|\Z)", t, re.I | re.S)
    if m:
        out["resumen"] = m.group(1).strip()
    # recomendaciones (varios formatos)
    def extract_list(label):
        m = re.search(rf"{label}\s*[:=]\s*(.+?)(?=\n(?:recomendaciones|riesgos|estadisticas|resumen)\s*[:=]|\Z)", t, re.I | re.S)
        if not m:
            return []
        block = m.group(1).strip()
        block = block.strip()
        # si es JSON array
        try:
            cleaned = block
            if cleaned.startswith("'") and cleaned.endswith("'"):
                cleaned = cleaned[1:-1]
            parsed = json.loads(cleaned)
            if isinstance(parsed, list):
                return [str(x) for x in parsed]
        except Exception:
            pass
        # líneas con guiones
        items = re.findall(r"^-+\s*(.+)$", block, re.M)
        if items:
            return [it.strip() for it in items]
        # líneas que comienzan con • or ·
        items = re.findall(r"^[•·\*\u2022]\s*(.+)$", block, re.M)
        if items:
            return [it.strip() for it in items]
        # separadas por comas o punto y coma
        if '\n' not in block and (',' in block or ';' in block):
            parts = re.split(r'[;,]\s*', block)
            return [p.strip() for p in parts if p.strip()]
        # si es bloque multilínea sin guiones, cada línea es item
        lines = [ln.strip() for ln in block.splitlines() if ln.strip()]
        if len(lines) > 1:
            return lines
        # fallback single entry
        return [block] if block else []

    out["recomendaciones"] = extract_list("recomendaciones")
    out["riesgos"] = extract_list("riesgos")

    # estadisticas: intentar extraer JSON entre llaves
    mstat = re.search(r"estadisticas\s*[:=]\s*(\{.*\})", t, re.I | re.S)
    if mstat:
        js = mstat.group(1)
        try:
            out["estadisticas"] = json.loads(js)
        except Exception:
            # intentar reemplazar = por : y comillas simples por dobles
            try:
                js2 = js.replace("=", ":").replace("'", '"')
                out["estadisticas"] = json.loads(js2)
            except Exception:
                out["estadisticas"] = {"raw": js}
    else:
        # buscar cualquier JSON suelto
        try:
            maybe_json = re.search(r"(\{[\s\S]*\})", t)
            if maybe_json:
                out["estadisticas"] = json.loads(maybe_json.group(1))
        except Exception:
            out["estadisticas"] = {}

    # asegurar llaves
    if "resumen" not in out:
        # como fallback tomar primeras 200 chars del texto
        out["resumen"] = (t[:1000] + "...") if len(t) > 1000 else t

    # normalizar tipos
    out.setdefault("recomendaciones", [])
    out.setdefault("riesgos", [])
    out.setdefault("estadisticas", {})

    return out


@router.post("/analyze")
async def analyze(req: AnalisisRequest):
    """
    Analiza un diagnóstico con IA usando OpenRouter (API_KEY en .env) pidiendo la salida en TOON.
    Devuelve siempre JSON (el backend parsea TOON->JSON). Si falla la llamada, devuelve fallback simulado.
    """
    diagnostico = (req.diagnostico or "").strip()
    API_KEY = os.getenv("API_KEY")
    MODEL = os.getenv("OPENROUTER_MODEL", "mistralai/mistral-7b-instruct:free")

    # instrucción clara para que devuelva TOON y una breve especificación de TOON esperada
    toon_spec = (
        "RESPONDE SOLO EN TOON. TOON es un formato compactado pensado para ahorrar tokens. "
        "Formato esperado (ejemplo):\n\n"
        "resumen: <texto breve>\n"
        "recomendaciones: - item1\n- item2\n- item3\n"
        "riesgos: - riesgo1\n- riesgo2\n"
        "estadisticas: {\"totalConsultas\": 5, \"consultaId\": 123}\n\n"
        "Importante: responde únicamente el bloque TOON sin texto adicional ni explicaciones."
    )

    prompt = (
        "Eres un asistente médico-dental. Analiza el siguiente diagnóstico y responde en TOON "
        "siguiendo la especificación provista (muy compacto, solo TOON):\n\n"
        f"Diagnóstico:\n{diagnostico}\n\n"
        f"Historiales:\n{json.dumps(req.historiales or [], ensure_ascii=False)}\n\n"
        f"{toon_spec}"
    )

    # llamar a OpenRouter si hay API_KEY
    if API_KEY:
        try:
            import httpx

            payload = {
                "model": MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.0,
                "max_tokens": 1200,
            }

            headers = {
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            }

            url = "https://api.openrouter.ai/v1/chat/completions"

            async with httpx.AsyncClient(timeout=60) as client:
                resp = await client.post(url, headers=headers, json=payload)
                resp.raise_for_status()
                data = resp.json()

            # obtener contenido generado
            content = None
            try:
                content = data["choices"][0]["message"]["content"]
            except Exception:
                content = data.get("output") or None

            if content:
                # Intentar primero parsear JSON (por si devolvió JSON)
                try:
                    parsed = json.loads(content)
                    return parsed
                except Exception:
                    # Si no es JSON, asumimos TOON y lo parseamos
                    parsed = parse_toon(content)
                    return parsed
        except Exception as e:
            logger.exception("Error llamando a OpenRouter: %s", e)

    # Fallback simulado si falla llamada o no hay API_KEY
    return {
        "resumen": f"Análisis simulado basado en: {diagnostico[:200]}",
        "recomendaciones": [
            "Revisión cada 6 meses",
            "Refuerzo de higiene bucal",
            "Programar seguimiento si hay dolor"
        ],
        "riesgos": ["Tendencia a caries", "Posible gingivitis"],
        "estadisticas": {
            "consultaAnalizada": {"id": req.consulta_id},
            "totalConsultasAnalizadas": len(req.historiales or [])
        }
    }