"""
Script para ejecutar la migración: agregar columna doctor_id a la tabla paciente
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
MYSQL_HOST = os.getenv("DB_HOST", "localhost")
MYSQL_DB = os.getenv("DB_NAME")

# Crear URL de conexión (ajuste según el driver instalado, por defecto mysqldb o pymysql)
# Intentaremos con pymysql que es común en entornos de desarrollo Python
SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
)

def run_migration_doctor_id():
    """Ejecuta la migración para agregar la columna doctor_id a la tabla paciente"""
    try:
        print(f"Conectando a la base de datos: {MYSQL_DB} en {MYSQL_HOST}...")
        engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
        
        with engine.connect() as connection:
            # 1. Verificar si la columna doctor_id ya existe en la tabla paciente
            check_query = text("""
                SELECT COUNT(*) as count
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = :db_name
                AND TABLE_NAME = 'paciente'
                AND COLUMN_NAME = 'doctor_id'
            """)
            
            result = connection.execute(check_query, {"db_name": MYSQL_DB})
            row = result.fetchone()
            
            if row and row[0] > 0:
                print("✓ La columna 'doctor_id' ya existe en la tabla 'paciente'.")
            else:
                # Agregar la columna doctor_id
                print("Agregando columna 'doctor_id' a la tabla 'paciente'...")
                migration_query = text("""
                    ALTER TABLE paciente 
                    ADD COLUMN doctor_id INT NULL,
                    ADD CONSTRAINT fk_paciente_doctor FOREIGN KEY (doctor_id) REFERENCES doctor(id)
                """)
                connection.execute(migration_query)
                connection.commit()
                print("✓ Columna 'doctor_id' agregada exitosamente.")

            # 2. Opcional: Asignar pacientes existentes al primer doctor si es necesario
            # para que no queden huérfanos en el Dashboard.
            # print("Vinculando pacientes huérfanos al primer doctor disponible...")
            # update_query = text(\"\"\"
            #     UPDATE paciente SET doctor_id = (SELECT id FROM doctor LIMIT 1) 
            #     WHERE doctor_id IS NULL AND (SELECT COUNT(*) FROM doctor) > 0
            # \"\"\" )
            # connection.execute(update_query)
            # connection.commit()

            print("\n✓ Migración finalizada con éxito.")
            return True
            
    except Exception as e:
        print(f"✗ Error ejecutando migración: {e}")
        return False

if __name__ == "__main__":
    success = run_migration_doctor_id()
    sys.exit(0 if success else 1)
