<?php

// Configuración de errores (evitar que se mezclen con JSON)
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header("Content-Type: application/json");

// ======================
// CONFIGURACIÓN MAIL
// ======================
define("SMTP_SERVER", "smtp.gmail.com");
define("SMTP_PORT", 587);
define("SMTP_USER", "vitadev03@gmail.com");
define("SMTP_PASS", "smfd rgab valf hncy");
define("MAIL_DESTINO", "vitadev03@gmail.com");

// ======================
// LEER JSON
// ======================
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

// ======================
// LIMPIAR DATOS
// ======================
$name      = trim($data["name"] ?? "");
$email     = trim($data["email"] ?? "");
$number    = trim($data["number"] ?? "");
$servicio  = trim($data["servicio"] ?? "");
$message   = trim($data["message"] ?? "");
$recaptcha = trim($data["recaptcha"] ?? "");

// ======================
// VALIDACIONES
// ======================
if (!$name) {
    http_response_code(400);
    echo json_encode(["error" => "El nombre es obligatorio", "field" => "name"]);
    exit;
}

if (!preg_match("/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/u", $name)) {
    http_response_code(400);
    echo json_encode(["error" => "El nombre solo puede contener letras y espacios", "field" => "name"]);
    exit;
}

if (!$email) {
    http_response_code(400);
    echo json_encode(["error" => "El email es obligatorio", "field" => "email"]);
    exit;
}

if (!$message) {
    http_response_code(400);
    echo json_encode(["error" => "El mensaje es obligatorio", "field" => "message"]);
    exit;
}

if (!$recaptcha) {
    http_response_code(400);
    echo json_encode(["error" => "Por favor, completá el reCAPTCHA", "field" => "recaptcha"]);
    exit;
}

if (strlen($number) < 7) {
    http_response_code(400);
    echo json_encode(["error" => "El numero es demasiado corto", "field" => "number"]);
    exit;
}

// Validación dominio
if (strpos($email, "@") !== false) {
    $dominio = explode("@", $email)[1];
    if (strpos($dominio, ".") === false) {
        http_response_code(400);
        echo json_encode(["error" => "Falta el dominio (ejemplo: .com, .net)", "field" => "email"]);
        exit;
    }
}

if (!preg_match("/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/", $email)) {
    http_response_code(400);
    echo json_encode(["error" => "Email inválido", "field" => "email"]);
    exit;
}

if (strlen($name) > 50) {
    http_response_code(400);
    echo json_encode(["error" => "El nombre es demasiado largo", "field" => "name"]);
    exit;
}

if (strlen($name) < 3) {
    http_response_code(400);
    echo json_encode(["error" => "El nombre es demasiado corto", "field" => "name"]);
    exit;
}

if (strlen($message) < 4) {
    http_response_code(400);
    echo json_encode(["error" => "El mensaje es demasiado corto", "field" => "message"]);
    exit;
}

if (strlen($message) > 2000) {
    http_response_code(400);
    echo json_encode(["error" => "El mensaje es demasiado largo", "field" => "message"]);
    exit;
}

// ======================
// VERIFICAR RECAPTCHA
// ======================
$recaptcha_secret = "6LfqVjwsAAAAAJ44ZEIsQBZHQyAAuEbsuXQ8kOQO"; // ← Reemplazar con tu clave real

$ch = curl_init("https://www.google.com/recaptcha/api/siteverify");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => http_build_query([
        "secret" => $recaptcha_secret,
        "response" => $recaptcha
    ]),
    CURLOPT_SSL_VERIFYPEER => true,  // ← Mantener en true para producción
    CURLOPT_TIMEOUT => 10
]);

$response = curl_exec($ch);
$curl_error = curl_error($ch);

if ($response === false) {
    error_log("Error cURL reCAPTCHA: " . $curl_error);
    http_response_code(500);
    echo json_encode([
        "error" => "Error al verificar reCAPTCHA",
        "field" => "recaptcha"
    ]);
    exit;
}

$result = json_decode($response, true);

if ($result === null) {
    http_response_code(500);
    echo json_encode([
        "error" => "Respuesta inválida del servidor de reCAPTCHA",
        "field" => "recaptcha"
    ]);
    exit;
}

if (!isset($result["success"]) || !$result["success"]) {
    http_response_code(400);
    echo json_encode([
        "error" => "reCAPTCHA inválido, por favor verifica.",
        "field" => "recaptcha"
    ]);
    exit;
}

// ======================
// ENVIAR MAIL (PHPMailer SMTP)
// ======================
require __DIR__ . "/PHPMailer/src/Exception.php";
require __DIR__ . "/PHPMailer/src/PHPMailer.php";
require __DIR__ . "/PHPMailer/src/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = SMTP_SERVER;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;

    $mail->setFrom(SMTP_USER, "Web");
    $mail->addAddress(MAIL_DESTINO);
    $mail->addReplyTo($email);

    $mail->Subject = "Nueva consulta web - $servicio";
    $mail->Body = "
Nueva consulta desde la web

Nombre: $name
Email: $email
Teléfono: $number
Servicio: $servicio

Mensaje:
$message
";

    $mail->send();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo enviar el correo"]);
    exit;
}

echo json_encode(["success" => true, "message" => "Formulario enviado"]);