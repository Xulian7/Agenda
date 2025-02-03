import sqlite3

def init_db():
    with sqlite3.connect("horario.db") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS horario (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dia TEXT NOT NULL,
                hora TEXT NOT NULL,
                actividad TEXT NOT NULL
            )
        """)
        conn.commit()

if __name__ == "__main__":
    init_db()
    print("Base de datos creada correctamente.")
