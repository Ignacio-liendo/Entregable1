document.addEventListener("DOMContentLoaded", async () => {
    // Elementos del DOM
    const nombreSpan = document.getElementById("nombreUsuario");
    const nombreInput = document.getElementById("nombreInput");
    const btnGuardarNombre = document.getElementById("guardarNombre");
    const saldoSpan = document.getElementById("saldo");
    const inputMonto = document.getElementById("monto");
    const btnDepositar = document.getElementById("depositar");
    const btnRetirar = document.getElementById("retirar");
    const btnLimpiarHistorial = document.getElementById("limpiarHistorial");
    const btnLimpiarGrafica = document.getElementById("limpiarGrafica");
    const historialTransacciones = document.getElementById("historialTransacciones");
    const ctx = document.getElementById("saldoChart").getContext("2d");

    let saldo = 0;
    let nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario";
    let historialSaldos = [];
    let historialFechas = [];
    let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

    // Cargar datos
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        saldo = localStorage.getItem("saldo") ? parseFloat(localStorage.getItem("saldo")) : data.usuario.saldo;
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        saldo = 1000;
    }

    nombreSpan.textContent = nombreUsuario;
    saldoSpan.textContent = `$${saldo.toFixed(2)}`;

    // Crear gráfico
    let saldoChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: historialFechas,
            datasets: [{
                label: "Saldo ($)",
                data: historialSaldos,
                borderColor: "blue",
                backgroundColor: "rgba(0, 123, 255, 0.1)",
                fill: true,
                tension: 0.3
            }]
        }
    });

    function actualizarHistorial() {
        historialTransacciones.innerHTML = "";
        transacciones.forEach(t => {
            let row = `<tr>
                <td>${t.fecha}</td>
                <td>${t.tipo}</td>
                <td>$${parseFloat(t.monto).toFixed(2)}</td>
                <td>$${parseFloat(t.saldo).toFixed(2)}</td>
            </tr>`;
            historialTransacciones.innerHTML += row;
        });
        localStorage.setItem("transacciones", JSON.stringify(transacciones));
    }

    function actualizarSaldo() {
        saldoSpan.textContent = `$${saldo.toFixed(2)}`;
        btnRetirar.disabled = saldo <= 0;

        historialFechas.push(new Date().toLocaleTimeString());
        historialSaldos.push(saldo);

        if (historialFechas.length > 10) {
            historialFechas.shift();
            historialSaldos.shift();
        }

        saldoChart.data.labels = historialFechas;
        saldoChart.data.datasets[0].data = historialSaldos;
        saldoChart.update();
    }

    function realizarTransaccion(tipo, monto) {
        if (!isNaN(monto) && monto > 0) {
            if (tipo === "Retiro" && monto > saldo) {
                return Swal.fire("Error", "Saldo insuficiente.", "error");
            }

            saldo = tipo === "Depósito" ? saldo + monto : saldo - monto;
            localStorage.setItem("saldo", saldo);

            transacciones.push({ fecha: new Date().toLocaleString(), tipo, monto, saldo });
            actualizarSaldo();
            actualizarHistorial();
        } else {
            Swal.fire("Error", "Ingrese un monto válido.", "error");
        }
    }

    btnDepositar.addEventListener("click", () => realizarTransaccion("Depósito", parseFloat(inputMonto.value)));
    btnRetirar.addEventListener("click", () => realizarTransaccion("Retiro", parseFloat(inputMonto.value)));
    btnLimpiarHistorial.addEventListener("click", () => {
        localStorage.removeItem("transacciones");
        transacciones = [];
        actualizarHistorial();
    });
    btnLimpiarGrafica.addEventListener("click", () => {
        historialFechas.length = 0; // Vaciar el array correctamente
        historialSaldos.length = 0;
        
        saldoChart.data.labels = [];
        saldoChart.data.datasets[0].data = [];
        
        saldoChart.update(); // Actualizar la gráfica
    });    
    actualizarSaldo();
    actualizarHistorial();
});
