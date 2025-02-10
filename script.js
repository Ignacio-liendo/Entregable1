
// Variables y constantes
const nombreUsuario = prompt("Ingrese su nombre:");
let saldo = 0;

// Función para mostrar el saldo
function mostrarSaldo() {
    alert(`${nombreUsuario}, tu saldo actual es: $${saldo}`);
}

// Función para depositar dinero
function depositar() {
    let monto = parseFloat(prompt("Ingrese el monto a depositar:"));
    if (!isNaN(monto) && monto > 0) {
        saldo += monto;
        alert(`Depósito exitoso. Nuevo saldo: $${saldo}`);
    } else {
        alert("Monto no válido. Intente de nuevo.");
    }
}

// Función para retirar dinero
function retirar() {
    let monto = parseFloat(prompt("Ingrese el monto a retirar:"));
    if (!isNaN(monto) && monto > 0 && monto <= saldo) {
        saldo -= monto;
        alert(`Retiro exitoso. Nuevo saldo: $${saldo}`);
    } else {
        alert("Monto no válido o saldo insuficiente.");
    }
}

// Menú de opciones
function menu() {
    let opcion;
    do {
        opcion = prompt("Seleccione una opción:\n1. Ver saldo\n2. Depositar\n3. Retirar\n4. Salir");
        switch (opcion) {
            case "1":
                mostrarSaldo();
                break;
            case "2":
                depositar();
                break;
            case "3":
                retirar();
                break;
            case "4":
                alert("Gracias por usar el simulador.");
                break;
            default:
                alert("Opción no válida.");
        }
    } while (opcion !== "4");
}

// Iniciar simulador
menu();
