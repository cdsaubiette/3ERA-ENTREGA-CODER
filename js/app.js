import { agregarAlCarrito, actualizarCarritoEnDOM, abrirCarritoModal, cerrarCarritoModal, minimizarCarritoModal } from './carrito.js'; // Asegúrate de que esté importando correctamente las funciones de carrito.js

// Función para cargar productos desde un archivo JSON
async function cargarProductos() {
    try {
        const response = await fetch('../json/productos.json');
        const productos = await response.json();

        const grid = document.querySelector('.grid');
        
        if (!grid) {
            console.error("Contenedor de productos no encontrado");
            return;
        }

        productos.forEach(({ id, nombre, imagen, precio }) => { // Desestructuración
            const card = document.createElement('div');
            card.classList.add('producto-card');

            card.innerHTML = `
                <img src="${imagen}" alt="${nombre}">
                <h3>${nombre}</h3>
                <p>Precio: ${precio}</p>
                <button class="btn-agregar" data-id="${id}">Agregar al carrito</button>
            `;

            grid.appendChild(card);
        });

        // Asignar el evento de agregar al carrito
        asignarEventosAgregarCarrito();
        
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Función para asignar los eventos correctamente
function asignarEventosAgregarCarrito() {
    const botones = document.querySelectorAll('.btn-agregar');

    botones.forEach(boton => {
        // Asegurarse de que no se asignen eventos duplicados
        boton.removeEventListener('click', manejarClicAgregar); // Elimina cualquier evento previo.
        boton.addEventListener('click', manejarClicAgregar);
    });
}

// Función para manejar el clic en "Agregar al carrito"
function manejarClicAgregar(e) {
    const productoId = e.target.getAttribute('data-id');
    agregarAlCarrito(productoId); // Llamar a la función de agregar al carrito
    actualizarCarritoEnDOM(); // Actualizar la vista del carrito
}

// Evento para abrir el carrito al hacer clic en el ícono
document.querySelector('.carro img').addEventListener('click', (event) => {
    event.preventDefault();  // Prevenir la redirección a otra página
    abrirCarritoModal(); // Abre el modal
});

// Evento para cerrar el carrito al hacer clic en el botón de cerrar
document.getElementById('cerrarBtn').addEventListener('click', cerrarCarritoModal);

// Evento para minimizar el carrito al hacer clic en el botón de minimizar
document.getElementById('minimizarBtn').addEventListener('click', minimizarCarritoModal);

// Cargar los productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);
