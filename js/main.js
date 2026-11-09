const PRECIO_PRODUCTO = 350;
const COSTO_ENVIO = 120;
let cantidadDetalle = 1;
let cantidadCarrito = 1;
let tallaSeleccionada = 'G';
let carritoTieneProducto = true;
let productoSeleccionado = { nombre: 'Top Rose', imagen: 'img/top-rose.jpg' };


function mostrarPantalla(idPantalla) {
    document.querySelectorAll('.page-section').forEach(seccion => {
        seccion.style.display = 'none';
    });

    const pantalla = document.getElementById(idPantalla);

    if (pantalla) {
        pantalla.style.display =
            idPantalla === 'screen-detalle' ? 'flex' : 'block';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function actualizarCantidadDetalle() {
    const valor = document.getElementById('qty-value');
    if (valor) valor.textContent = cantidadDetalle;
}

function actualizarCarrito() {
    const contenedor = document.querySelector('.cart-container');
    if (!contenedor) return;
    if (!carritoTieneProducto) {
        contenedor.innerHTML = '<div class="empty-cart"><h3>Tu carrito está vacío</h3><p>Explora nuestra colección y encuentra algo que te encante.</p><button type="button" class="next-btn" id="volver-tienda">Volver a la tienda</button></div>' ;
        document.getElementById('volver-tienda').addEventListener('click', () => mostrarPantalla('screen-catalogo'));
        return;
    }
    const subtotal = PRECIO_PRODUCTO * cantidadCarrito;
    const total = subtotal + COSTO_ENVIO;
    const qty = contenedor.querySelector('.cart-controls-price .quantity-control span');
    const unitPrice = contenedor.querySelector('.unit-price');
    const summary = contenedor.querySelectorAll('.summary-row span:last-child');
    if (qty) qty.textContent = cantidadCarrito;
    if (unitPrice) unitPrice.textContent = `$${subtotal}`;
    if (summary[0]) summary[0].textContent = `$${subtotal}`;
    if (summary[1]) summary[1].textContent = `$${COSTO_ENVIO}`;
    const totalElement = contenedor.querySelector('.total-row strong:last-child');
    if (totalElement) totalElement.textContent = `$${total}`;
}

document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const destino = link.dataset.nav;
        if (destino === 'inicio') { mostrarPantalla('screen-catalogo'); window.scrollTo(0, 0); }
        if (destino === 'ropa') { mostrarPantalla('screen-catalogo'); document.getElementById('catalog-grid').scrollIntoView({ behavior: 'smooth' }); }
        if (destino === 'ofertas') { mostrarPantalla('screen-catalogo'); document.getElementById('novedades').scrollIntoView({ behavior: 'smooth' }); }
        if (destino === 'contacto') { mostrarPantalla('screen-catalogo'); document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' }); }
    });
});

document.querySelectorAll('.top-card').forEach(card => {
    card.addEventListener('click', () => {
        productoSeleccionado = {
            nombre: card.dataset.product,
            imagen: card.dataset.image
        };

        const esRose = productoSeleccionado.nombre === 'Top Rose';
        document.querySelector('#screen-detalle .product-info h1').textContent = productoSeleccionado.nombre;
        document.querySelector('#screen-detalle .main-image img').src = esRose ? 'img/top-rose-main.png' : productoSeleccionado.imagen;
        document.querySelector('#screen-detalle .main-image img').alt = productoSeleccionado.nombre;
        document.querySelector('.thumbnail-list').style.display = esRose ? 'flex' : 'none';
        document.querySelector('#screen-carrito .cart-header h3').textContent = productoSeleccionado.nombre;
        document.querySelector('#screen-carrito .cart-product-image img').src = productoSeleccionado.imagen;
        document.querySelector('#screen-carrito .cart-product-image img').alt = productoSeleccionado.nombre;
        document.querySelector('#screen-exito .product-summary h3').textContent = productoSeleccionado.nombre;
        mostrarPantalla('screen-detalle');
    });
});


document.querySelectorAll('.category-item').forEach(item => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    const seleccionar = () => {

        document.querySelectorAll('.category-item').forEach(c => {
            c.classList.remove('active');
        });

        item.classList.add('active');

        const grid = document.getElementById('catalog-grid');
        const esTop = item.dataset.category === 'tops';

        grid.style.display = esTop ? 'grid' : 'none';

        let aviso = document.getElementById('categoria-aviso');

        if (!esTop) {
            if (!aviso) {
                aviso = document.createElement('p');
                aviso.id = 'categoria-aviso';
                aviso.className = 'empty-cart';
                grid.after(aviso);
            }

            aviso.textContent =
                'Próximamente agregaremos productos de esta categoría.';

        } else if (aviso) {
            aviso.remove();
        }
    };

    item.addEventListener('click', seleccionar);

    item.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            seleccionar();
        }
    });
});


document.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
        const imagenPrincipal = document.getElementById('current-img');
        if (imagenPrincipal) imagenPrincipal.src = thumb.src;
        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    });
});

document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        tallaSeleccionada = btn.textContent.trim();
    });
});

const btnMas = document.getElementById('qty-plus');
const btnMenos = document.getElementById('qty-minus');
if (btnMas) btnMas.addEventListener('click', () => { cantidadDetalle++; actualizarCantidadDetalle(); });
if (btnMenos) btnMenos.addEventListener('click', () => { cantidadDetalle = Math.max(1, cantidadDetalle - 1); actualizarCantidadDetalle(); });

const btnAgregar = document.getElementById('btn-agregar');
if (btnAgregar) btnAgregar.addEventListener('click', () => {
    cantidadCarrito = cantidadDetalle;
    carritoTieneProducto = true;
    actualizarCarrito();
    mostrarPantalla('screen-carrito');
});

const controlesCarrito = document.querySelector('.cart-controls-price .quantity-control');
if (controlesCarrito) {
    const botones = controlesCarrito.querySelectorAll('.qty-btn');
    if (botones[0]) botones[0].addEventListener('click', () => { cantidadCarrito++; actualizarCarrito(); });
    if (botones[1]) botones[1].addEventListener('click', () => { cantidadCarrito = Math.max(1, cantidadCarrito - 1); actualizarCarrito(); });
}
const btnEliminar = document.querySelector('.remove-btn');
if (btnEliminar) btnEliminar.addEventListener('click', () => { carritoTieneProducto = false; actualizarCarrito(); });

const btnCompra = document.getElementById('btn-iniciar-compra');
if (btnCompra) btnCompra.addEventListener('click', () => {
    if (!carritoTieneProducto) { alert('Agrega un producto antes de iniciar tu compra.'); return; }
    mostrarPantalla('screen-entrega');
});

const btnSiguientePago = document.getElementById('btn-siguiente-pago');
if (btnSiguientePago) btnSiguientePago.addEventListener('click', () => {
    const campos = document.querySelectorAll('#screen-entrega .cyan-input');
    const incompleto = Array.from(campos).some(campo => !campo.value.trim());
    if (incompleto) { alert('Por favor, completa tus datos de contacto y entrega.'); return; }
    mostrarPantalla('screen-pago');
});

document.querySelectorAll('.pay-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.pay-option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

const btnFinalizar = document.getElementById('btn-finalizar');
if (btnFinalizar) btnFinalizar.addEventListener('click', () => {
    const campos = document.querySelectorAll('#screen-pago .cyan-input');
    const incompleto = Array.from(campos).some(campo => !campo.value.trim());
    if (incompleto) { alert('Completa los datos de pago para continuar.'); return; }
    const total = PRECIO_PRODUCTO * cantidadCarrito + COSTO_ENVIO;
    const resumen = document.querySelector('#screen-exito .total-summary strong');
    const producto = document.querySelector('#screen-exito .product-summary span');
    if (resumen) resumen.textContent = `Total: $${total}`;
    if (producto) producto.textContent = `Talla ${tallaSeleccionada} - Color Rosa · ${cantidadCarrito} pieza(s)`;
    mostrarPantalla('screen-exito');
});

actualizarCarrito();