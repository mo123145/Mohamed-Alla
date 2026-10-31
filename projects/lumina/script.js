const PRODUCTS = [
    { id: 'elite-headphones', name: 'Lumina Elite Headphones', category: 'audio', price: 129.99, image: 'headphones.png', alt: 'Lumina Elite wireless headphones' },
    { id: 'studio-speaker', name: 'Studio Bluetooth Speaker', category: 'audio', price: 89.99, icon: '🔊' },
    { id: 'smart-watch', name: 'Lumina Smart Watch', category: 'wearables', price: 149.99, icon: '⌚' },
    { id: 'fitness-band', name: 'Active Fitness Band', category: 'wearables', price: 59.99, icon: '⌚' },
    { id: 'wireless-charger', name: 'Wireless Charging Pad', category: 'accessories', price: 34.99, icon: '🔋' },
    { id: 'travel-case', name: 'Travel Tech Organizer', category: 'accessories', price: 24.99, icon: '🎒' }
];

const CART_STORAGE_KEY = 'lumina-demo-cart';
const productGrid = document.getElementById('productGrid');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const cartMessage = document.getElementById('cartMessage');
let cart = loadCart();

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}');
        if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
        return Object.fromEntries(Object.entries(saved).filter(([id, quantity]) =>
            PRODUCTS.some(product => product.id === id) &&
            Number.isInteger(quantity) &&
            quantity > 0
        ));
    } catch (error) {
        console.error('Unable to load the Lumina demo cart:', error);
        return {};
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error('Unable to save the Lumina demo cart:', error);
        cartMessage.textContent = 'Cart changes are temporary because browser storage is unavailable.';
        return false;
    }
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const imageBox = document.createElement('div');
    imageBox.className = 'product-image';
    if (product.image) {
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.alt;
        image.loading = 'lazy';
        imageBox.appendChild(image);
    } else {
        const icon = document.createElement('span');
        icon.textContent = product.icon;
        icon.setAttribute('aria-hidden', 'true');
        icon.style.fontSize = '5rem';
        imageBox.appendChild(icon);
    }

    const overlay = document.createElement('div');
    overlay.className = 'add-to-cart-overlay';
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'overlay-btn';
    addButton.textContent = 'Add to Cart';
    addButton.setAttribute('aria-label', `Add ${product.name} to cart`);
    addButton.addEventListener('click', () => {
        cart[product.id] = (cart[product.id] || 0) + 1;
        const saved = saveCart();
        renderCart();
        cartMessage.textContent = saved ? `${product.name} added to your demo cart.` : cartMessage.textContent;
    });
    overlay.appendChild(addButton);

    const info = document.createElement('div');
    info.className = 'product-info';
    const category = document.createElement('span');
    category.className = 'product-category';
    category.textContent = product.category;
    const title = document.createElement('h3');
    title.className = 'product-title';
    title.textContent = product.name;
    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = `$${product.price.toFixed(2)}`;
    info.append(category, title, price);
    card.append(imageBox, overlay, info);
    return card;
}

function renderProducts(category = 'all') {
    productGrid.replaceChildren();
    PRODUCTS
        .filter(product => category === 'all' || product.category === category)
        .forEach(product => productGrid.appendChild(createProductCard(product)));
}

function renderCart() {
    const entries = Object.entries(cart)
        .map(([id, quantity]) => ({ product: PRODUCTS.find(item => item.id === id), quantity }))
        .filter(entry => entry.product && Number.isInteger(entry.quantity) && entry.quantity > 0);
    const totalQuantity = entries.reduce((sum, entry) => sum + entry.quantity, 0);
    const totalPrice = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);

    cartCount.textContent = String(totalQuantity);
    cartCount.setAttribute('aria-label', `${totalQuantity} items in cart`);
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartItems.replaceChildren();

    if (entries.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Your cart is empty.';
        empty.style.cssText = 'color:#94a3b8;text-align:center;margin-top:2rem';
        cartItems.appendChild(empty);
        return;
    }

    entries.forEach(({ product, quantity }) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        const image = document.createElement('img');
        image.src = product.image || 'headphones.png';
        image.alt = product.image ? product.alt : '';
        const info = document.createElement('div');
        info.style.flex = '1';
        const title = document.createElement('strong');
        title.textContent = product.name;
        const price = document.createElement('p');
        price.textContent = `$${product.price.toFixed(2)} × ${quantity}`;
        const controls = document.createElement('div');
        controls.className = 'cart-quantity-controls';
        const decrease = document.createElement('button');
        decrease.type = 'button';
        decrease.textContent = '−';
        decrease.setAttribute('aria-label', `Decrease ${product.name} quantity`);
        decrease.addEventListener('click', () => updateQuantity(product.id, -1));
        const count = document.createElement('span');
        count.textContent = String(quantity);
        const increase = document.createElement('button');
        increase.type = 'button';
        increase.textContent = '+';
        increase.setAttribute('aria-label', `Increase ${product.name} quantity`);
        increase.addEventListener('click', () => updateQuantity(product.id, 1));
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.addEventListener('click', () => {
            delete cart[product.id];
            saveCart();
            renderCart();
        });
        controls.append(decrease, count, increase, remove);
        info.append(title, price, controls);
        row.append(image, info);
        cartItems.appendChild(row);
    });
}

function updateQuantity(productId, change) {
    const nextQuantity = (cart[productId] || 0) + change;
    if (nextQuantity <= 0) delete cart[productId];
    else cart[productId] = nextQuantity;
    saveCart();
    renderCart();
}

function setCartOpen(open) {
    cartModal.classList.toggle('open', open);
    cartOverlay.classList.toggle('open', open);
    cartModal.setAttribute('aria-hidden', String(!open));
    document.getElementById('cartBtn').setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) document.getElementById('closeCart').focus();
    else document.getElementById('cartBtn').focus();
}

document.getElementById('categoryFilters').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    document.querySelectorAll('.filter-btn').forEach(filter => {
        filter.classList.toggle('active', filter === button);
    });
    renderProducts(button.dataset.category);
});

document.getElementById('cartBtn').addEventListener('click', () => setCartOpen(true));
document.getElementById('closeCart').addEventListener('click', () => setCartOpen(false));
cartOverlay.addEventListener('click', () => setCartOpen(false));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && cartModal.classList.contains('open')) setCartOpen(false);
});
document.getElementById('checkoutBtn').addEventListener('click', () => {
    cartMessage.textContent = 'This is a demo store. Checkout and payment are not available.';
});

renderProducts();
renderCart();
