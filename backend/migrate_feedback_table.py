"""
Script para crear la tabla feedback en la base de datos si no existe.
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

MYSQL_USER = os.getenv("DB_USER")
MYSQL_PASSWORD = os.getenv("DB_PASSWORD")
MYSQL_HOST = os.getenv("DB_HOST", "localhost")
MYSQL_DB = os.getenv("DB_NAME")

SQLALCHEMY_DATABASE_URL = (
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}/{MYSQL_DB}"
)

def run_migration_feedback():
    """Crea la tabla feedback si no existe."""
    try:
        print(f"Conectando a la base de datos: {MYSQL_DB} en {MYSQL_HOST}...")
        engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
        with engine.connect() as connection:
            # Verificar si la tabla feedback ya existe
            check_query = text("""
                SELECT COUNT(*) as count
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = :db_name
                AND TABLE_NAME = 'feedback'
            """)
            result = connection.execute(check_query, {"db_name": MYSQL_DB})
            row = result.fetchone()
            if row and row[0] > 0:
                print("✓ La tabla 'feedback' ya existe.")
            else:
                print("Creando tabla 'feedback'...")
                create_query = text("""
                    CREATE TABLE feedback (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        paciente_id INT NOT NULL,
                        nivel_dolor INT,
                        control_medicacion VARCHAR(100),
                        sangrado VARCHAR(100),
                        inflamacion VARCHAR(100),
                        fiebre BOOLEAN DEFAULT FALSE,
                        dificultad_tragar BOOLEAN DEFAULT FALSE,
                        mal_sabor BOOLEAN DEFAULT FALSE,
                        entumecimiento BOOLEAN DEFAULT FALSE,
                        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
                        doctor_id INT NULL,
                        FOREIGN KEY (paciente_id) REFERENCES paciente(id),
                        FOREIGN KEY (doctor_id) REFERENCES doctor(id)
                    ) ENGINE=InnoDB;
                """)
                connection.execute(create_query)
                connection.commit()
                print("✓ Tabla 'feedback' creada exitosamente.")
        print("\n✓ Migración de feedback finalizada con éxito.")
        return True
    except Exception as e:
        print(f"✗ Error ejecutando migración de feedback: {e}")
        return False

if __name__ == "__main__":
    success = run_migration_feedback()
    sys.exit(0 if success else 1)
