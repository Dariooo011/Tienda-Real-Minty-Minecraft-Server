let saldo = 0;
let carrito = [];
const saldoDisplay = document.getElementById('saldo');
const nombreJugadorDisplay = document.getElementById('nombre-jugador');
const listaCarrito = document.getElementById('lista-carrito');

window.onload = function() {
    const nombre = prompt("¿Cuál es tu nombre de Minecraft?");
    saldo = parseFloat(prompt("¿Cuánto dinero tienes en Nautic?"));
    nombreJugadorDisplay.innerText = `Jugador: ${nombre}`;
    actualizarSaldo();
};

document.querySelectorAll('.rango').forEach(item => {
    item.addEventListener('click', () => {
        const nombre = item.dataset.nombre;
        const precio = parseFloat(item.dataset.precio);
        const cantidad = parseInt(document.getElementById('cantidad').value);
        agregarAlCarrito(nombre, precio, cantidad);
    });
});

function agregarAlCarrito(nombre, precio, cantidad) {
    carrito.push({ nombre, precio, cantidad });
    actualizarCarrito();
}

function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerText = `${item.cantidad}x ${item.nombre} - ${item.precio * item.cantidad} €/$`;
        listaCarrito.appendChild(li);
    });
}

function actualizarSaldo() {
    saldoDisplay.innerText = `Saldo: ${saldo.toFixed(2)} €/$`;
}

function confirmarCompra() {
    if (carrito.length === 0) return alert("El carrito está vacío.");

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    if (total > saldo) return alert("No tienes suficiente saldo.");

    if (confirm("¿Estás seguro/a de que quieres comprar estos artículos?")) {
        saldo -= total;
        carrito = [];
        actualizarCarrito();
        actualizarSaldo();
        alert("¡Compra realizada con éxito!");
    }
}
