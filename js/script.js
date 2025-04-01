// Archivo: script.js

document.addEventListener("DOMContentLoaded", async () => {
    const nombreSpan = document.getElementById("nombreUsuario");
    const nombreInput = document.getElementById("nombreInput");
    const btnGuardarNombre = document.getElementById("guardarNombre");
    const saldoSpan = document.getElementById("saldo");
    const inputMonto = document.getElementById("monto");
    const btnDepositar = document.getElementById("depositar");
    const btnRetirar = document.getElementById("retirar");

    let saldo = 0;
    let nombreUsuario = "";

    // Cargar datos desde JSON
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        saldo = data.usuario.saldo;
        nombreUsuario = data.usuario.nombre;
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }

    // Mostrar datos en pantalla
    nombreSpan.textContent = nombreUsuario;
    saldoSpan.textContent = `$${saldo.toFixed(2)}`;
    
    // Función para actualizar saldo en pantalla
    function actualizarSaldo() {
        saldoSpan.textContent = `$${saldo.toFixed(2)}`;
        btnRetirar.disabled = saldo <= 0;
    }

    // Guardar el nombre del usuario
    btnGuardarNombre.addEventListener("click", () => {
        const nuevoNombre = nombreInput.value.trim();
        if (nuevoNombre) {
            nombreUsuario = nuevoNombre;
            nombreSpan.textContent = nombreUsuario;
            Swal.fire("Éxito", "Nombre guardado con éxito", "success");
        } else {
            Swal.fire("Error", "Ingrese un nombre válido.", "error");
        }
    });

    // Evento para depositar dinero
    btnDepositar.addEventListener("click", () => {
        let monto = parseFloat(inputMonto.value);
        if (!isNaN(monto) && monto > 0) {
            saldo += monto;
            actualizarSaldo();
            Swal.fire("Depósito exitoso", `Se depositaron $${monto.toFixed(2)}`, "success");
            inputMonto.value = "";
        } else {
            Swal.fire("Error", "Ingrese un monto válido.", "error");
        }
    });

    // Evento para retirar dinero
    btnRetirar.addEventListener("click", () => {
        let monto = parseFloat(inputMonto.value);
        if (!isNaN(monto) && monto > 0 && monto <= saldo) {
            saldo -= monto;
            actualizarSaldo();
            Swal.fire("Retiro exitoso", `Se retiraron $${monto.toFixed(2)}`, "success");
            inputMonto.value = "";
        } else {
            Swal.fire("Error", "Monto no válido o saldo insuficiente.", "error");
        }
    });

    actualizarSaldo();
});
