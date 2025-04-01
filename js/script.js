// Archivo: script.js

// Obtener elementos del DOM
const nombreSpan = document.getElementById("nombreUsuario");
const nombreInput = document.getElementById("nombreInput");
const btnGuardarNombre = document.getElementById("guardarNombre");
const saldoSpan = document.getElementById("saldo");
const inputMonto = document.getElementById("monto");
const btnDepositar = document.getElementById("depositar");
const btnRetirar = document.getElementById("retirar");

// Obtener saldo y nombre desde localStorage o valores iniciales
totalizarSaldo();
cargarUsuario();

// Función para obtener y actualizar saldo desde JSON simulado
async function totalizarSaldo() {
    try {
        const respuesta = await fetch("data.json");
        const datos = await respuesta.json();
        let saldo = Number(localStorage.getItem("saldo")) || datos.saldoInicial;
        actualizarSaldo(saldo);
    } catch (error) {
        console.error("Error al cargar los datos: ", error);
    }
}

// Función para cargar el nombre de usuario
totalizarSaldo();
cargarUsuario();
function cargarUsuario() {
    let nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario";
    nombreSpan.textContent = nombreUsuario;
    nombreInput.value = nombreUsuario;
}

// Función para actualizar saldo en pantalla y localStorage
function actualizarSaldo(saldo) {
    saldoSpan.textContent = `$${saldo.toFixed(2)}`;
    localStorage.setItem("saldo", saldo.toFixed(2));
    btnRetirar.disabled = saldo <= 0;
}

// Guardar el nombre del usuario
btnGuardarNombre.addEventListener("click", () => {
    let nombreUsuario = nombreInput.value.trim();
    if (nombreUsuario) {
        nombreSpan.textContent = nombreUsuario;
        localStorage.setItem("nombreUsuario", nombreUsuario);
        Swal.fire("Nombre guardado con éxito", "", "success");
    } else {
        Swal.fire("Ingrese un nombre válido.", "", "error");
    }
});

// Evento para depositar dinero
btnDepositar.addEventListener("click", () => {
    let monto = parseFloat(inputMonto.value);
    if (!isNaN(monto) && monto > 0) {
        let saldoActual = Number(localStorage.getItem("saldo"));
        let nuevoSaldo = saldoActual + monto;
        actualizarSaldo(nuevoSaldo);
        Swal.fire(`Depósito de $${monto.toFixed(2)} realizado con éxito`, "", "success");
        inputMonto.value = "";
    } else {
        Swal.fire("Ingrese un monto válido.", "", "error");
    }
});

// Evento para retirar dinero
btnRetirar.addEventListener("click", () => {
    let monto = parseFloat(inputMonto.value);
    let saldoActual = Number(localStorage.getItem("saldo"));
    if (!isNaN(monto) && monto > 0 && monto <= saldoActual) {
        let nuevoSaldo = saldoActual - monto;
        actualizarSaldo(nuevoSaldo);
        Swal.fire(`Retiro de $${monto.toFixed(2)} realizado con éxito`, "", "success");
        inputMonto.value = "";
    } else {
        Swal.fire("Monto no válido o saldo insuficiente.", "", "error");
    }
});
