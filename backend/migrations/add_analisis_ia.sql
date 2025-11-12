-- Migration: Add analisis_ia column to historial_clinico table
-- Date: 2024

ALTER TABLE historial_clinico 
ADD COLUMN analisis_ia JSON NULL COMMENT 'Almacena análisis de IA en formato JSON';
