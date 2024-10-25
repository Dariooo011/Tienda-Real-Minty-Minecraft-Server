// script.js

let carrito = [];
let saldoDisponible = 0;

function iniciar() {
    const nombre = document.getElementById("nombreMC").value;
    saldoDisponible = parseInt(document.getElementById("saldo").value);

    if (nombre && saldoDisponible > 0 && saldoDisponible <= 4000000) {
        localStorage.setItem("nombre", nombre);
        localStorage.setItem("saldo", saldoDisponible);

        document.getElementById("nombreUsuario").textContent = nombre;
        document.getElementById("saldoDisponible").textContent = saldoDisponible;

        document.getElementById("entrada").style.display = "none";
        document.getElementById("tienda").style.display = "block";
    } else {
        alert("Por favor, ingrese un nombre válido y un saldo entre 1 y 4000000.");
    }
}

function agregarCarrito(nombreProducto, precio) {
    if (saldoDisponible < precio) {
        alert("No tienes suficiente saldo para este producto.");
        return;
    }

    if (confirm("¿Estás seguro/a de que quieres comprar este artículo?")) {
        carrito.push({ nombre: nombreProducto, precio: precio });
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const itemsCarrito = document.getElementById("itemsCarrito");
    itemsCarrito.innerHTML = "";

    carrito.forEach((item, index) => {
        itemsCarrito.innerHTML += `<p>${item.nombre} - €${item.precio}</p>`;
    });
}

function comprar() {
    const totalCompra = carrito.reduce((total, item) => total + item.precio, 0);

    if (totalCompra > saldoDisponible) {
        alert("No tienes suficiente saldo para completar la compra.");
        return;
    }

    saldoDisponible -= totalCompra;
    carrito = [];

    document.getElementById("saldoDisponible").textContent = saldoDisponible;
    actualizarCarrito();
    alert("Compra realizada con éxito.");
}
