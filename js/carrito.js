let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const guardarEnLocalStorage = () => localStorage.setItem('carrito', JSON.stringify(carrito));

const mostrarToast = (mensaje, duracion = 2000) => {
    Toastify({
        text: mensaje,
        duration: duracion, 
        close: true, 
        gravity: "top", 
        position: "right", 
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)" 
    }).showToast();
};

const obtenerProductoPorId = (productoId) => {
    const productos = [
        { id: 1, nombre: "VueJS", precio: "$25" },
        { id: 2, nombre: "AngularJS", precio: "$25" },
        { id: 3, nombre: "ReactJS", precio: "$25" },
        { id: 4, nombre: "Redux", precio: "$25" },
        { id: 5, nombre: "NodeJS", precio: "$25" },
        { id: 6, nombre: "SASS", precio: "$25" },
        { id: 7, nombre: "HTML5", precio: "$25" },
        { id: 8, nombre: "GitHub", precio: "$25" },
        { id: 9, nombre: "BULMA", precio: "$25" },
        { id: 10, nombre: "TypeScript", precio: "$25" },
        { id: 11, nombre: "Drupal", precio: "$25" },
        { id: 12, nombre: "JavaScript", precio: "$25" },
        { id: 13, nombre: "GraphQL", precio: "$25" },
        { id: 14, nombre: "Wordpress", precio: "$25" }
    ];
    return productos.find(producto => producto.id === parseInt(productoId));
};

export const agregarAlCarrito = (productoId) => {
    const producto = obtenerProductoPorId(productoId);
    if (!producto) return;

    const productoEnCarrito = carrito.find(({ id }) => id === productoId);
    productoEnCarrito ? productoEnCarrito.cantidad++ : carrito.push({ ...producto, cantidad: 1 });

    guardarEnLocalStorage();
    mostrarToast("Producto agregado al carrito");
    actualizarCarritoEnDOM();
};

export const actualizarCarritoEnDOM = () => {
    const contenedorCarrito = document.querySelector('.carrito-contenedor');
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = carrito.length === 0 
        ? '<p>Tu carrito está vacío.</p>'
        : carrito.map(({ id, nombre, precio, cantidad }) => `
            <div class="producto-en-carrito">
                <p>Nombre: ${nombre}</p>
                <p>Precio: ${precio}</p>
                <p>Cantidad:
                    <button class="boton-cantidad" data-producto-id="${id}" data-accion="incrementar">+</button>
                    <span class="cantidad">${cantidad}</span>
                    <button class="boton-cantidad" data-producto-id="${id}" data-accion="decrementar">-</button>
                </p>
                <button class="boton-eliminar" data-producto-id="${id}">🗑️</button>
            </div>
        `).join('');
};

export const modificarCantidad = (productoId, accion) => {
    const productoEnCarrito = carrito.find(({ id }) => id === parseInt(productoId));
    if (!productoEnCarrito) return;

    if (accion === 'incrementar') productoEnCarrito.cantidad++;
    if (accion === 'decrementar' && productoEnCarrito.cantidad > 0) productoEnCarrito.cantidad--;

    guardarEnLocalStorage();
    actualizarCarritoEnDOM();
};

const eliminarProductoDelCarrito = (productoId) => {
    carrito = carrito.filter(({ id }) => id !== parseInt(productoId));
    guardarEnLocalStorage();
    actualizarCarritoEnDOM();
};

const confirmarEliminarProducto = (productoId) => {
    const mensajeConfirmacion = document.createElement('div');
    mensajeConfirmacion.classList.add('mensaje-confirmacion');
    mensajeConfirmacion.innerHTML = `
        <p>¿Estás seguro de que deseas eliminar este producto del carrito?</p>
        <button class="confirmar-eliminar" data-producto-id="${productoId}">Sí</button>
        <button class="cancelar-eliminar">No</button>
    `;
    document.body.appendChild(mensajeConfirmacion);

    mensajeConfirmacion.style.display = 'block';

    document.querySelector('.confirmar-eliminar').addEventListener('click', () => {
        eliminarProductoDelCarrito(productoId);
        document.body.removeChild(mensajeConfirmacion);
    });

    document.querySelector('.cancelar-eliminar').addEventListener('click', () => {
        document.body.removeChild(mensajeConfirmacion);
    });
};

export const cerrarCarritoModal = () => {
    const carritoModal = document.getElementById("carritoModal");
    if (carritoModal) {
        carritoModal.classList.remove("modal-visible");
        carritoModal.classList.add("modal-oculto");
    }
};

export const abrirCarritoModal = () => {
    const carritoModal = document.getElementById("carritoModal");
    if (carritoModal) {
        carritoModal.classList.remove("modal-oculto");
        carritoModal.classList.add("modal-visible");
    }
};

export const minimizarCarritoModal = () => {
    const carritoModal = document.getElementById("carritoModal");
    carritoModal.classList.toggle("minimizado");
};

document.getElementById('minimizarBtn').addEventListener('click', () => {
    const carritoModal = document.getElementById("carritoModal");
    carritoModal.classList.toggle('minimizado');
});

document.getElementById('vaciarCarritoBtn').addEventListener('click', () => {
    carrito = [];
    guardarEnLocalStorage();
    actualizarCarritoEnDOM();
});

document.querySelector('.carrito-contenedor').addEventListener('click', (event) => {
    const productoId = event.target.dataset.productoId;
    
    if (event.target.classList.contains('boton-cantidad')) {
        const accion = event.target.dataset.accion;
        modificarCantidad(productoId, accion);
    }

    if (event.target.classList.contains('boton-eliminar')) {
        confirmarEliminarProducto(productoId);
    }
});
