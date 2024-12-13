import { agregarAlCarrito, actualizarCarritoEnDOM } from './carrito.js'; // Importar las funciones necesarias

// Cargar los productos dinámicamente en producto.html
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

        // Evento para agregar al carrito
        const botones = document.querySelectorAll('.btn-agregar');
        botones.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const idProducto = e.target.getAttribute('data-id');
                agregarAlCarrito(idProducto); // Llamar a la función de agregar al carrito
                actualizarCarritoEnDOM(); // Actualizar el carrito en el DOM
            });
        });
        
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

// Llamada inicial para cargar los productos
document.addEventListener('DOMContentLoaded', cargarProductos);
