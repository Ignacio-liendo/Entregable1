// Archivo: script.js

// Obtener elementos del DOM
const nombreSpan = document.getElementById("nombreUsuario");
const saldoSpan = document.getElementById("saldo");
const inputMonto = document.getElementById("monto");
const btnDepositar = document.getElementById("depositar");
const btnRetirar = document.getElementById("retirar");

// Obtener saldo desde localStorage o establecer valor inicial
let saldo = parseFloat(localStorage.getItem("saldo")) || 1000;
const nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario";

// Mostrar datos en pantalla
nombreSpan.textContent = nombreUsuario;
saldoSpan.textContent = `$${saldo.toFixed(2)}`;

// Función para actualizar saldo en pantalla y localStorage
function actualizarSaldo() {
    saldoSpan.textContent = `$${saldo.toFixed(2)}`;
    localStorage.setItem("saldo", saldo);
}

// Evento para depositar dinero
btnDepositar.addEventListener("click", () => {
    let monto = parseFloat(inputMonto.value);
    if (!isNaN(monto) && monto > 0) {
        saldo += monto;
        actualizarSaldo();
        inputMonto.value = "";
    } else {
        alert("Ingrese un monto válido.");
    }
});

// Evento para retirar dinero
btnRetirar.addEventListener("click", () => {
    let monto = parseFloat(inputMonto.value);
    if (!isNaN(monto) && monto > 0 && monto <= saldo) {
        saldo -= monto;
        actualizarSaldo();
        inputMonto.value = "";
    } else {
        alert("Monto no válido o saldo insuficiente.");
    }
});
