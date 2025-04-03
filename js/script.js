document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const login = document.getElementById("login");
    const banco = document.getElementById("banco");
    const nombreSpan = document.getElementById("nombreUsuario");
    const saldoSpan = document.getElementById("saldo");
    const inputMonto = document.getElementById("monto");
    const historialTransacciones = document.getElementById("historialTransacciones");
    const ctx = document.getElementById("saldoChart").getContext("2d");

    const loginBtn = document.getElementById("loginBtn");
    const btnDepositar = document.getElementById("depositar");
    const btnRetirar = document.getElementById("retirar");
    const btnTransferir = document.getElementById("transferir");
    const btnPagarServicio = document.getElementById("pagarServicio");
    const btnLimpiarHistorial = document.getElementById("limpiarHistorial");
    const btnLimpiarGrafica = document.getElementById("limpiarGrafica");

    // Recuperar datos de localStorage
    let datos = JSON.parse(localStorage.getItem("banco")) || { saldo: 1000, transacciones: [] };
    let nombreGuardado = localStorage.getItem("nombreUsuario");

    // Autenticación con PIN
    loginBtn.addEventListener("click", () => {
        const nombre = document.getElementById("nombreInput").value.trim();
        const pin = document.getElementById("pinInput").value.trim();

        if (!nombre || !pin) {
            return Swal.fire("Error", "Ingrese nombre y PIN.", "error");
        }

        // Guardar nombre y mostrarlo
        localStorage.setItem("nombreUsuario", nombre);
        nombreSpan.textContent = nombre;

        // Mostrar la interfaz bancaria
        login.classList.add("d-none");
        banco.classList.remove("d-none");

        saldoSpan.textContent = `$${datos.saldo.toFixed(2)}`;
        actualizarHistorial();
    });

    // Mostrar el nombre guardado si existe
    if (nombreGuardado) {
        nombreSpan.textContent = nombreGuardado;
    }

    // Inicializar gráfica
    let historialFechas = datos.transacciones.map(t => t.fecha);
    let historialSaldos = datos.transacciones.map(t => t.saldo);

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

    // Función para actualizar historial
    function actualizarHistorial() {
        historialTransacciones.innerHTML = "";
        datos.transacciones.forEach(t => {
            let row = `<tr>
                <td>${t.fecha}</td>
                <td>${t.tipo}</td>
                <td>$${parseFloat(t.monto).toFixed(2)}</td>
                <td>$${parseFloat(t.saldo).toFixed(2)}</td>
            </tr>`;
            historialTransacciones.innerHTML += row;
        });
        localStorage.setItem("banco", JSON.stringify(datos));
    }

    // Función para actualizar saldo y gráfica
    function actualizarSaldo() {
        saldoSpan.textContent = `$${datos.saldo.toFixed(2)}`;

        historialFechas.push(new Date().toLocaleTimeString());
        historialSaldos.push(datos.saldo);

        if (historialFechas.length > 10) {
            historialFechas.shift();
            historialSaldos.shift();
        }

        saldoChart.data.labels = historialFechas;
        saldoChart.data.datasets[0].data = historialSaldos;
        saldoChart.update();
    }

    // Función para realizar transacciones
    function realizarTransaccion(tipo, monto) {
        if (!isNaN(monto) && monto > 0) {
            if (tipo === "Retiro" && monto > datos.saldo) {
                return Swal.fire("Error", "Saldo insuficiente.", "error");
            }

            datos.saldo = tipo === "Depósito" ? datos.saldo + monto : datos.saldo - monto;
            localStorage.setItem("banco", JSON.stringify(datos));

            datos.transacciones.push({
                fecha: new Date().toLocaleString(),
                tipo,
                monto,
                saldo: datos.saldo
            });

            actualizarSaldo();
            actualizarHistorial();
        } else {
            Swal.fire("Error", "Ingrese un monto válido.", "error");
        }
    }

    // Función para transferir dinero
    btnTransferir.addEventListener("click", () => {
        Swal.fire({
            title: "Transferencia de Dinero",
            input: "number",
            inputLabel: "Ingrese el monto a transferir",
            inputPlaceholder: "Ejemplo: 500",
            showCancelButton: true,
            confirmButtonText: "Transferir",
            preConfirm: (monto) => {
                monto = parseFloat(monto);
                if (isNaN(monto) || monto <= 0) {
                    Swal.showValidationMessage("Ingrese un monto válido.");
                } else if (monto > datos.saldo) {
                    Swal.showValidationMessage("Saldo insuficiente.");
                }
                return monto;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                realizarTransaccion("Transferencia", result.value);
                Swal.fire("¡Éxito!", `Se ha transferido $${result.value}`, "success");
            }
        });
    });

    // Función para pagar servicio
    btnPagarServicio.addEventListener("click", () => {
        Swal.fire({
            title: "Pago de Servicio",
            input: "number",
            inputLabel: "Ingrese el monto a pagar",
            inputPlaceholder: "Ejemplo: 300",
            showCancelButton: true,
            confirmButtonText: "Pagar",
            preConfirm: (monto) => {
                monto = parseFloat(monto);
                if (isNaN(monto) || monto <= 0) {
                    Swal.showValidationMessage("Ingrese un monto válido.");
                } else if (monto > datos.saldo) {
                    Swal.showValidationMessage("Saldo insuficiente.");
                }
                return monto;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                realizarTransaccion("Pago de Servicio", result.value);
                Swal.fire("¡Pago realizado!", `Se ha pagado $${result.value}`, "success");
            }
        });
    });

    // Eventos de botones
    btnDepositar.addEventListener("click", () => realizarTransaccion("Depósito", parseFloat(inputMonto.value)));
    btnRetirar.addEventListener("click", () => realizarTransaccion("Retiro", parseFloat(inputMonto.value)));
    btnLimpiarHistorial.addEventListener("click", () => {
        datos.transacciones = [];
        localStorage.setItem("banco", JSON.stringify(datos));
        actualizarHistorial();
    });
    btnLimpiarGrafica.addEventListener("click", () => {
        historialFechas.length = 0;
        historialSaldos.length = 0;
        saldoChart.data.labels = [];
        saldoChart.data.datasets[0].data = [];
        saldoChart.update();
    });

    actualizarSaldo();
    actualizarHistorial();
});
