from flask import Flask, request, jsonify, render_template
import re
import smtplib
from email.message import EmailMessage

app = Flask(__name__)

@app.route("/portfolio")
def portfolio():
    return render_template("portfolio.html")

# Mostrar el formulario
@app.route("/")
def home():
    return render_template("index.html")

# ======================
# CONFIGURACIÓN MAIL
# ======================
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "vitadev03@gmail.com"        # correo que envía
SMTP_PASS = "smfd rgab valf hncy"       # contraseña de app
MAIL_DESTINO = "vitadev03@gmail.com" # correo que recibe

# ======================
# ENDPOINT
# ======================
@app.route("/contacto", methods=["POST"])
def contacto():
    data = request.get_json(silent=True)

    if not data:
        return jsonify(error="Datos inválidos"), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    number = data.get("number", "").strip()
    servicio = data.get("servicio", "").strip()
    message = data.get("message", "").strip()

    # -------- VALIDACIONES --------
    if not name:
        return jsonify(error="El nombre es obligatorio"), 400

    if not email:
        return jsonify(error="El email es obligatorio"), 400

    if not message:
        return jsonify(error="El mensaje es obligatorio"), 400

    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
        return jsonify(error="Email inválido"), 400

    if len(message) > 2000:
        return jsonify(error="El mensaje es demasiado largo"), 400

    # -------- ARMAR MAIL --------
    msg = EmailMessage()
    msg["Subject"] = f"Nueva consulta web - {servicio}"
    msg["From"] = SMTP_USER
    msg["To"] = MAIL_DESTINO
    msg["Reply-To"] = email  # para responder directo al cliente

    msg.set_content(f"""
Nueva consulta desde la web

Nombre: {name}
Email: {email}
Teléfono: {number}
Servicio: {servicio}

Mensaje:
{message}
""")

    # -------- ENVIAR MAIL --------
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)

    except Exception as e:
        print(e)  # log interno
        return jsonify(error="No se pudo enviar el correo"), 500

    return jsonify(ok=True), 200


if __name__ == "__main__":
    app.run(debug=True)

