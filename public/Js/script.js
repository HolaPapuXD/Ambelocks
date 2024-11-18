document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    let isMenuOpen = false;

    // Verificar si los elementos existen antes de agregar los event listeners
    if (menuToggle && navLinks) {
        // Función para alternar el menú
        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            navLinks.classList.toggle('active');
            
            const menuIcon = menuToggle.querySelector('i');
            if (menuIcon) {
                if (isMenuOpen) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                } else {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        }

        // Event listener para el botón de menú
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Cerrar el menú cuando se hace clic en un enlace
        const links = navLinks.getElementsByTagName('a');
        for (let link of links) {
            link.addEventListener('click', function() {
                if (isMenuOpen) {
                    toggleMenu();
                }
            });
        }

        // Cerrar el menú cuando se hace clic fuera de él
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleMenu();
            }
        });
    }
    
    // Funciones para el carrito y resumen de pedido
    function initializeCartFunctions() {
        const cartContainer = document.getElementById('cart-items');
        const resumenProductos = document.getElementById('resumen-productos');
        
        if (cartContainer) {
            loadCartItems();
        }
        
        if (resumenProductos) {
            cargarResumenPedido();
        }
    }

    // Función para cargar items del carrito
    function loadCartItems() {
        const cartContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        const checkoutButton = document.getElementById('checkout-button');
        
        if (!cartContainer) return;

        const cart = getCart();
        let total = 0;
        cartContainer.innerHTML = '';

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            if (checkoutButton) checkoutButton.disabled = true;
            if (cartTotalElement) cartTotalElement.textContent = '0 COP';
            return;
        }

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            
            // Convertir el precio a número
            const priceNumber = parseInt(item.price.replace(/[^0-9]/g, ''));
            const itemTotal = priceNumber * item.quantity;
            total += itemTotal;
            
            itemElement.innerHTML = `
                <div class="cart-item-content">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>Precio: ${item.price}</p>
                        <div class="item-actions">
                            <div class="quantity-controls">
                                <button onclick="updateQuantity(${index}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateQuantity(${index}, 1)">+</button>
                            </div>
                            <button class="delete-item" onclick="removeItem(${index})">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            cartContainer.appendChild(itemElement);
        });

        if (cartTotalElement) {
            cartTotalElement.textContent = `${total.toLocaleString()} COP`;
        }

        if (checkoutButton) {
            checkoutButton.disabled = false;
        }
    }

    //Función para cargar resumen del pedido
    function cargarResumenPedido() {
        const resumenProductos = document.getElementById('resumen-productos');
        const totalPedidoElement = document.getElementById('total-pedido');
        
        // Si no existe el elemento resumenProductos, salir de la función
        if (!resumenProductos) return;
        
        const cart = getCart();
        let totalPedido = 0;

        // Limpiar el contenido existente
        resumenProductos.innerHTML = '';

        // Agregar cada producto al resumen
        cart.forEach(item => {
            const precioUnitario = parseInt(item.price.replace(/[^0-9]/g, '')); 
            const subtotal = precioUnitario * item.quantity;
            totalPedido += subtotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${precioUnitario.toLocaleString()} COP</td>
                <td>${subtotal.toLocaleString()} COP</td>
            `;
            resumenProductos.appendChild(tr);
        });

        // Actualizar el total solo si existe el elemento
        if (totalPedidoElement) {
            totalPedidoElement.textContent = `${totalPedido.toLocaleString()} COP`;
        }
    }

    // Manejador del formulario de contacto
    const contactForm = document.getElementById('form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('correo').value,
                mensaje: document.getElementById('mensaje').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('¡Mensaje enviado con éxito!');
                    this.reset();
                } else {
                    throw new Error(data.error || 'Error al enviar el mensaje');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al enviar el mensaje: ' + error.message);
            }
        });
    }

    // Inicializar funciones
    initializeCartFunctions();
});

// Array de productos
const peripherals = [
    {
        name: "Zeus X H510",
        price: "274.900 COP",
        category: "Auriculares",
        image: "../img/productos/ZEUS-X-B.png"
    },
    {
        name: "Blazar GM300",
        price: "259.900 COP",
        category: "Microfonos",
        image: "../img/productos/BLAZAR.png"
    },
    {
        name: "UCAL K673 PRO",
        price: "733.900 COP",
        category: "Teclados",
        image: "../img/productos/K673-UCAL-PRO.png"
    },
    {
        name: "K1ng M724",
        price: "22.299 COP",
        category: "Mouse",
        image: "../img/productos/KING-M724-B.png"
    },
    {
        name: "St4r M917",
        price: "229.90 COP",
        category: "Mouse",
        image: "../img/productos/STAR-PRO-M917B.png"
    },
    {
        name: "Redragon Ziggs K669",
        price: "239.940 COP",
        category: "Teclados",
        image: "../img/productos/Ziggs-K669-PNGHQ-1.png"
    }
];

// Funciones del carrito
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const cart = getCart();
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCountElement.textContent = totalItems;
    }
}

function addToCart(product) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    showNotification('Producto agregado al carrito');
}

// Funciones de la página del carrito
function loadCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    if (!cartContainer) return;

    const cart = getCart();
    let total = 0;
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        if (cartTotalElement) cartTotalElement.textContent = '0 COP';
        return;
    }

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        // Convertir el precio a número
        const priceNumber = parseInt(item.price.replace(/[^0-9]/g, ''));
        const itemTotal = priceNumber * item.quantity;
        total += itemTotal;
        
        itemElement.innerHTML = `
            <div class="cart-item-content">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Precio: ${item.price}</p>
                    <div class="item-actions">
                        <div class="quantity-controls">
                            <button onclick="updateQuantity(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                        <button class="delete-item" onclick="removeItem(${index})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        cartContainer.appendChild(itemElement);
    });

    if (cartTotalElement) {
        cartTotalElement.textContent = `${total.toLocaleString()} COP`;
    }
}

function updateQuantity(index, change) {
    const cart = getCart();
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart(cart);
    updateCartCount();
    loadCartItems();
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
    loadCartItems();
    showNotification('Producto eliminado del carrito');
}

function clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        localStorage.removeItem('cart');
        updateCartCount();
        loadCartItems();
        showNotification('Carrito vaciado');
    }
}

function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }
    window.location.href = 'formulario-envio.html';
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    loadPeripherals();
    updateCartCount();
    loadCartItems();
    
    // Menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
});

// Función para cargar los productos en el catálogo
function loadPeripherals() {
    const peripheralsList = document.getElementById('peripherals-list');
    if (!peripheralsList) return;

    peripheralsList.innerHTML = '';
    peripherals.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('peripheral-item');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="peripheral-info">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button onclick="addToCart({
                    name: '${product.name}',
                    price: '${product.price}',
                    image: '${product.image}'
                })" class="add-to-cart">
                    <i class="fas fa-shopping-cart"></i> Agregar al carrito
                </button>
            </div>
        `;
        peripheralsList.appendChild(productElement);
    });
}

// Función para procesar el formulario de envío
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-pago');
    if (!formulario) return;

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formulario);
        const metodoPago = formData.get('metodo-pago');

        if (!metodoPago) {
            showNotification('Seleccione un método de pago', 'error');
            return;
        }

        const botonPagar = formulario.querySelector('.boton-pagar');
        const textoOriginal = botonPagar.innerHTML;
        botonPagar.disabled = true;
        botonPagar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        try {
            const cart = getCart();
            
            // Enviar los correos usando la función de orderEmail.js
            await window.orderEmail.enviarCorreos(formData, cart);
            
            // Limpiar el carrito
            localStorage.removeItem('cart');
            
            // Mostrar mensaje de éxito
            showNotification('¡Pedido realizado con éxito! Se ha enviado la factura a tu correo.', 'success');
            
            // Redireccionar al catálogo después de 2 segundos
            setTimeout(() => {
                window.location.href = 'catalogo.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al procesar el pedido. Intente nuevamente.', 'error');
            botonPagar.disabled = false;
            botonPagar.innerHTML = textoOriginal;
        }
    });
});

// Función para validar el formulario (agrégala si no la tienes)
function validarFormulario(formData) {
    const campos = ['nombre', 'email', 'telefono', 'identificacion', 'direccion'];
    for (let campo of campos) {
        if (!formData.get(campo)) {
            showNotification(`Por favor complete el campo ${campo}`, 'error');
            return false;
        }
    }
    return true;
}  
