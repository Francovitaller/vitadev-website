
    var form = document.getElementById("contacto");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var data = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            number: document.getElementById("number").value.trim(),
            servicio: document.getElementById("servicio").value,
            message: document.getElementById("message").value.trim()
        };

        enviarFormulario(data);
    });


async function enviarFormulario(data) {
    try {
        // 1️⃣ envío al backend
        var response = await fetch("/contacto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        // 2️⃣ leo el JSON que devuelve Flask
        var res = await response.json();

        // 3️⃣ muestro resultado según backend
        if (res.ok) {
            alert("Mensaje enviado correctamente");
            document.getElementById("contacto").reset();
        } else {
            alert(res.error || "Error al enviar");
        }

    } catch (error) {
        // 4️⃣ error de red / servidor caído
        alert("Error de conexión con el servidor");
    }
}
