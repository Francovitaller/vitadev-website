from flask import Flask, request, jsonify, render_template
import re
import smtplib
import requests
from email.message import EmailMessage

app = Flask(__name__)

@app.route("/servicios")
def servicios():
    return render_template("servicios.html")

@app.route("/portfolio")
def portfolio():
    return render_template("portfolio.html")

@app.route("/aboutus")
def aboutus():
    return render_template("aboutus.html")

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
    recaptcha = data.get("recaptcha", "").strip()

    # -------- VALIDACIONES --------
    if not name:
        return jsonify(error="El nombre es obligatorio" , field= "name"), 400

    # Validación: nombre solo letras y espacios
    if not re.match(r"^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$", name):
        return jsonify(error="El nombre solo puede contener letras y espacios", field="name"), 400

    if not email:
        return jsonify(error="El email es obligatorio", field = "email"), 400

    if not message:
        return jsonify(error="El mensaje es obligatorio", field = "message"), 400

    if not recaptcha:
        return jsonify(error="Por favor, completá el reCAPTCHA", field="recaptcha"), 400

    if len(number) < 7:
        return jsonify(error="El numero es demasiado corto", field = "number"), 400

    # Si tiene @ pero no tiene punto después del @ (ej: fdobal@gmail)
    if "@" in email:
        parte_dominio = email.split("@")[-1]
        if "." not in parte_dominio:
            return jsonify(error="Falta el dominio (ejemplo: .com, .net)", field="email"), 400

    if not re.match(r"^[^@]+@[^@]+\.[a-zA-Z]{2,}$", email):
        return jsonify(error="Email inválido", field = "email"), 400




    if len(name) > 50:
        return jsonify(error="El nombre es demasiado largo", field = "name"), 400


    if len(name) < 3:
        return jsonify(error="El mensaje es demasiado corto", field = "message"), 400



    if len(message) < 4:
        return jsonify(error="El mensaje es demasiado corto", field="message"), 400
    if len(message) > 2000:
        return jsonify(error="El mensaje es demasiado largo", field="message"), 400



    recaptcha_token = data.get("recaptcha", "")
    recaptcha_secret = "6LfqVjwsAAAAAJ44ZEIsQBZHQyAAuEbsuXQ8kOQO"

    # Verificación reCAPTCHA
    recaptcha_verify = requests.post(
        "https://www.google.com/recaptcha/api/siteverify",
        data={"secret": recaptcha_secret, "response": recaptcha_token}
    ).json()

    if not recaptcha_verify.get("success", False):
        return jsonify(error="reCAPTCHA inválido, por favor verifica.", field = "recaptcha"), 400

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

    return jsonify(success=True, message="Formulario enviado"), 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)