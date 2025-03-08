// Archivo: script.js

// Obtener elementos del DOM
const nombreSpan = document.getElementById("nombreUsuario");
const nombreInput = document.getElementById("nombreInput");
const btnGuardarNombre = document.getElementById("guardarNombre");
const saldoSpan = document.getElementById("saldo");
const inputMonto = document.getElementById("monto");
const btnDepositar = document.getElementById("depositar");
const btnRetirar = document.getElementById("retirar");
const mensaje = document.getElementById("mensaje");

// Obtener saldo y nombre desde localStorage o establecer valores iniciales
let saldo = Number(localStorage.getItem("saldo")) || 1000;
let nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario";

// Mostrar datos en pantalla
nombreSpan.textContent = nombreUsuario;
nombreInput.value = nombreUsuario;
actualizarSaldo();

// Función para guardar datos en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem("saldo", saldo.toFixed(2));
    localStorage.setItem("nombreUsuario", nombreUsuario);
}

// Función para actualizar saldo en pantalla y localStorage
function actualizarSaldo() {
    saldo = Number(saldo.toFixed(2));
    saldoSpan.textContent = `$${saldo}`;
    btnRetirar.disabled = saldo <= 0;
    guardarEnLocalStorage();
}

// Función para mostrar mensajes en pantalla
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.style.color = tipo === "error" ? "red" : "green";
    setTimeout(() => mensaje.textContent = "", 3000);
}

// Guardar el nombre del usuario
btnGuardarNombre.addEventListener("click", () => {
    nombreUsuario = nombreInput.value.trim();
    if (nombreUsuario) {
        nombreSpan.textContent = nombreUsuario;
        guardarEnLocalStorage();
        mostrarMensaje("Nombre guardado con éxito", "success");
    } else {
        mostrarMensaje("Ingrese un nombre válido.", "error");
    }
});

// Evento para depositar dinero
btnDepositar.addEventListener("click", () => {
    let monto = parseFloat(inputMonto.value);
    if (!isNaN(monto) && monto > 0) {
        saldo += monto;
        actualizarSaldo();
        mostrarMensaje(`Depósito de $${monto.toFixed(2)} realizado con éxito`, "success");
        inputMonto.value = "";
    } else {
        mostrarMensaje("Ingrese un monto válido.", "error");
    }
});

// Evento para retirar dinero
btnRetirar.addEventListener("click", () => {
    let monto = parseFloat(inputMonto.value);
    if (!isNaN(monto) && monto > 0 && monto <= saldo) {
        saldo -= monto;
        actualizarSaldo();
        mostrarMensaje(`Retiro de $${monto.toFixed(2)} realizado con éxito`, "success");
        inputMonto.value = "";
    } else {
        mostrarMensaje("Monto no válido o saldo insuficiente.", "error");
    }
});
