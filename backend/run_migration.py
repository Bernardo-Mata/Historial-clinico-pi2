"""
Script para ejecutar la migración: agregar columna analisis_ia a historial_clinico
"""
import sys
import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Cargar variables de entorno
backend_dir = Path(__file__).resolve().parent
env_path = backend_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Obtener credenciales
MYSQL_USER = os.getenv("DB_USER")
MYSQL_PASSWORD = os.getenv("DB_PASSWORD")
MYSQL_HOST = os.getenv("DB_HOST")
MYSQL_DB = os.getenv("DB_NAME")

# Crear URL de conexión con pymysql
SQLALCHEMY_DATABASE_URL = (
    f"mysql+mysqldb://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
)

def run_migration():
    """Ejecuta la migración para agregar la columna analisis_ia"""
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
        
        with engine.connect() as connection:
            # Verificar si la columna ya existe
            check_query = text("""
                SELECT COUNT(*) as count
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'historial_clinico'
                AND COLUMN_NAME = 'analisis_ia'
            """)
            
            result = connection.execute(check_query)
            row = result.fetchone()
            
            if row[0] > 0:
                print("✓ La columna 'analisis_ia' ya existe en la tabla historial_clinico")
                return True
            
            # Agregar la columna
            migration_query = text("""
                ALTER TABLE historial_clinico 
                ADD COLUMN analisis_ia JSON NULL COMMENT 'Almacena análisis de IA en formato JSON'
            """)
            
            connection.execute(migration_query)
            connection.commit()
            
            print("✓ Migración completada exitosamente")
            print("✓ Columna 'analisis_ia' agregada a la tabla historial_clinico")
            return True
            
    except Exception as e:
        print(f"✗ Error ejecutando migración: {e}")
        return False

if __name__ == "__main__":
    success = run_migration()
    sys.exit(0 if success else 1)
