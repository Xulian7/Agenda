from flask import Flask, request, jsonify, render_template
import mysql.connector

app = Flask(__name__)

def init_db():
    try:
        conn = mysql.connector.connect(
            host="sql211.infinityfree.com",
            user="if0_38231335",    
            password="uXR3zxa1061X",
            database="if0_38231335_Mixie" 
        )
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS horario (
                id INT AUTO_INCREMENT PRIMARY KEY,
                dia VARCHAR(255) NOT NULL,
                hora VARCHAR(255) NOT NULL,
                actividad VARCHAR(255) NOT NULL
            )
        """)
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print(f"Error: {err}")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/guardar", methods=["POST"])
def guardar():
    try:
        datos = request.json
        conn = mysql.connector.connect(
            host="sql211.infinityfree.com",
            user="if0_38231335",    
            password="uXR3zxa1061X",
            database="if0_38231335_Mixie" 
        )
        cursor = conn.cursor()
        cursor.execute("REPLACE INTO horario (dia, hora, actividad) VALUES (%s, %s, %s)",
                       (datos["dia"], datos["hora"], datos["actividad"]))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Guardado exitoso"})
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "No se pudo guardar en la base de datos"}), 500

@app.route("/cargar", methods=["GET"])
def cargar():
    try:
        conn = mysql.connector.connect(
            host="sql211.infinityfree.com",
            user="if0_38231335",    
            password="uXR3zxa1061X",
            database="if0_38231335_Mixie" 
        )
        cursor = conn.cursor()
        cursor.execute("SELECT dia, hora, actividad FROM horario")
        datos = [{"dia": row[0], "hora": row[1], "actividad": row[2]} for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return jsonify(datos)
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "No se pudo cargar los datos"}), 500

@app.route("/eliminar", methods=["POST"])
def eliminar():
    try:
        datos = request.json
        conn = mysql.connector.connect(
            host="sql211.infinityfree.com",
            user="if0_38231335",    
            password="uXR3zxa1061X",
            database="if0_38231335_Mixie" 
        )
        cursor = conn.cursor()
        cursor.execute("DELETE FROM horario WHERE dia = %s AND hora = %s", (datos["dia"], datos["hora"]))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"mensaje": "Eliminado correctamente"})
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "No se pudo eliminar el dato"}), 500

if __name__ == "__main__":
    init_db()
    app.run(debug=True)


#uXR3zxa1061X

