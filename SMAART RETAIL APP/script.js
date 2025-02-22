let products = [
    {
        id: 1,
        name: "Rice (25kg)",
        price: 900.00,
        category: "Food",
        quantity: 100,
        lowStockAlert:20,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFzFUv0Qs-xjVblV7p9yMyAvD9iqqkSDQlbg&s"
    },
    {
        id: 2,
        name: "Cola",
        price: 20.00,
        category: "Drinks",
        quantity: 20,
        lowStockAlert:10,
        image: "https://m.media-amazon.com/images/I/71rtyKeefDL.jpg"
    },
    {
        id: 3,
        name: "Chips",
        price: 20.00,
        category: "Snacks",
        quantity: 75,
        lowStockAlert:20,
        image: "https://www.bigbasket.com/media/uploads/p/xl/294283_18-lays-potato-chips-spanish-tomato-tango.jpg"
    },
    {
        id: 4,
        name: "Sensodyne",
        price: 109.00,
        category: "Paste",
        quantity: 105,
        lowStockAlert:20,
        image: "https://m.media-amazon.com/images/I/61ilcRHc9PL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        id: 5,
        name: "Mysore Sandal",
        price: 42.00,
        category: "Soap",
        quantity: 100,
        lowStockAlert:20,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyz0PU8sSVaByhXSB7ODl-8ky49uGdJlq2Rg&s"
    },
    {
        id: 6,
        name: "Dairy Milk",
        price: 80.00,
        category: "Chocolate",
        quantity: 50,
        lowStockAlert:20,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZaZGvpJJLe8JBvqe4BA_6jD56cq1-ZB4hEg&s"
    },
    {
        id: 7,
        name: "Toor Dal",
        price: 120.00,
        category: "Food",
        quantity: 50,
        lowStockAlert:20,
        image: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/641ebe2fec031454ba71e06a/toor-dal-unpolised-front.png"
    },
    {
        id: 8,
        name: "Salt",
        price: 10.00,
        category: "Kitchen Items",
        quantity: 24,
        lowStockAlert:20,
        image: "https://m.media-amazon.com/images/I/614mm2hYHyL._AC_UF1000,1000_QL80_.jpg"
         
    },
    {
        id: 9,
        name: "Dove ",
        price: 69.00,
        category: "Shampoo",
        quantity: 14,
        lowStockAlert:20,
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI0w_OFzLo6egEuB0OVrclyU1E5I9UReXgQA&s"
    },
    
];

let cart = [];
let isLoggedIn = false;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initializeLogin();
    if (isLoggedIn) {
        initializeStore();
    }
});

function initializeLogin() {
    if (!localStorage.getItem('loggedInUser')) {
        const username = prompt("Enter Username:");
        const password = prompt("Enter Password:");
        if (username && password) {
            localStorage.setItem('loggedInUser', JSON.stringify({ username, password }));
            isLoggedIn = true;
        } else {
            alert("Login failed. Refresh to try again.");
        }
    } else {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const username = prompt("Enter Username:", user.username);
        const password = prompt("Enter Password:", user.password);
        if (username === user.username && password === user.password) {
            isLoggedIn = true;
        } else {
            alert("Incorrect credentials. Refresh to try again.");
        }
    }
}

function initializeStore() {
    displayProducts('all');
    setupEventListeners();
    
}
function initializeStore() {
    displayProducts('all');  // First, display all the products
    checkLowStock();  // Now, check for low stock after displaying products
    setupEventListeners();  // Continue with setting up event listeners
}


function checkLowStock() {
    products.forEach(product => {
        if (product.quantity <= product.lowStockAlert) {
            alert(`Alert: ${product.name} is running low on stock! Only ${product.quantity} left.`);
            // Optional: Highlight the product card in red to indicate low stock
            const productElement = document.querySelector(`.product-card[data-product-id="${product.id}"]`);
            if (productElement) {
                productElement.style.border = '2px solid red';  // Adds a red border to low-stock products
            }
        }
    });
}


function displayProducts(category) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category || p.name.toLowerCase().includes(category.toLowerCase()));

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard);
    });
}
function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.setAttribute('data-product-id', product.id);

    div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3>${product.name}</h3>
        <p>Price: ₹${product.price.toFixed(2)}</p>
        <p>Stock: ${product.quantity}</p>
        <button onclick="openEditModal(${product.id})">Edit</button>
    `;

    // Create and add stock status button
    const stockStatusButton = document.createElement('button');
    stockStatusButton.className = 'stock-status-button';
    stockStatusButton.style.backgroundColor = product.quantity > product.lowStockAlert ? 'blue' : 'red';
    stockStatusButton.textContent = product.quantity > product.lowStockAlert ? 'In Stock' : 'Low Stock';
    div.appendChild(stockStatusButton);

    // Add click event listener to the product image to add to the shopping cart
    div.querySelector('.product-image').addEventListener('click', () => addToCart(product.id));

    return div;
}

function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('category').value = product.category;
    document.getElementById('quantity').value = product.quantity;
    document.getElementById('lowStockAlert').value = product.lowStockAlert || 0;
    document.getElementById('image').value = product.image;

    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    // Update the form submit functionality
    const form = document.getElementById('itemForm');
    form.onsubmit = (e) => {
        e.preventDefault();

        product.name = document.getElementById('name').value;
        product.price = parseFloat(document.getElementById('price').value);
        product.category = document.getElementById('category').value;
        product.quantity = parseInt(document.getElementById('quantity').value);
        product.lowStockAlert = parseInt(document.getElementById('lowStockAlert').value);
        product.image = document.getElementById('image').value;

        displayProducts('all');
        modal.style.display = 'none';
    };
}


function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.quantity === 0) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        if (cartItem.quantity < product.quantity) {
            cartItem.quantity++;
        }
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const total = document.getElementById('total');
    cartItems.innerHTML = '';
    
    let totalAmount = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})">🗑️</button>
                <span>₹${itemTotal.toFixed(2)}</span>
            </div>
        `;
        cartItems.appendChild(div);
    });

    total.textContent = totalAmount.toFixed(2);
    calculateChange();
}

function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (cartItem) {
        const newQuantity = cartItem.quantity + change;
        if (newQuantity > 0 && newQuantity <= product.quantity) {
            cartItem.quantity = newQuantity;
        } else if (newQuantity === 0) {
            removeFromCart(productId);
            return;
        }
    }
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function calculateChange() {
    const total = parseFloat(document.getElementById('total').textContent);
    const paid = parseFloat(document.getElementById('paid').value) || 0;
    const change = document.getElementById('change');
    const changeAmount = paid - total;
    change.textContent = changeAmount >= 0 ? changeAmount.toFixed(2) : '0.00';
}

function generateBill() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    const paid = parseFloat(document.getElementById('paid').value) || 0;
    const total = parseFloat(document.getElementById('total').textContent);

    if (paid < total) {
        alert('Insufficient payment amount!');
        return;
    }

    const billModal = document.getElementById('billModal');
    const billItems = document.getElementById('billItems');
    const billTotal = document.getElementById('billTotal');
    const billPaid = document.getElementById('billPaid');
    const billChange = document.getElementById('billChange');

    billItems.innerHTML = cart.map(item => `
        <div class="bill-item">
            ${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}
        </div>
    `).join('');

    billTotal.textContent = total.toFixed(2);
    billPaid.textContent = paid.toFixed(2);
    billChange.textContent = (paid - total).toFixed(2);

    billModal.style.display = 'block';

    // Update inventory
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.quantity -= item.quantity;
        }
    });

    // Clear cart
    cart = [];
    updateCartDisplay();
    displayProducts('all');
}

// Inside setupEventListeners()
function setupEventListeners() {
    document.querySelector('.search form').addEventListener('submit', (e) => {
        e.preventDefault();
        const query = e.target.querySelector('input').value;
        displayProducts(query);
    });

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            displayProducts(e.target.dataset.category);
        });
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.getElementById('modal').style.display = 'none';
            document.getElementById('billModal').style.display = 'none';
            document.getElementById('profileModal').style.display = 'none';
        });
    });

    document.getElementById('addItem').addEventListener('click', () => {
        const form = document.getElementById('itemForm');
    
        // Reset all form fields to their default values
        form.reset();
    
        // Reset the modal behavior to "Add New Item"
        form.onsubmit = (e) => {
            e.preventDefault();
    
            const newItem = {
                id: products.length + 1,
                name: document.getElementById('name').value,
                price: parseFloat(document.getElementById('price').value),
                category: document.getElementById('category').value,
                quantity: parseInt(document.getElementById('quantity').value),
                lowStockAlert: parseInt(document.getElementById('lowStockAlert').value),
                image: document.getElementById('image').value
            };
    
            products.push(newItem); // Add the new product to the array
            displayProducts('all'); // Refresh the product list
            document.getElementById('modal').style.display = 'none'; // Close the modal
            form.reset(); // Reset the form again to ensure a clean slate
        };
    
        // Show the modal
        document.getElementById('modal').style.display = 'block';
    });
    

    document.getElementById('generateBill').addEventListener('click', generateBill);

    // **New Print Bill functionality**
    document.getElementById('printBill').addEventListener('click', () => {
        // Open the print dialog
        window.print();

        // After printing, close the bill modal
        document.getElementById('billModal').style.display = 'none';
    });

    document.getElementById('paid').addEventListener('input', calculateChange);

    document.getElementById('profileButton').addEventListener('click', () => {
        document.getElementById('profileModal').style.display = 'block';
    });

    document.getElementById('itemForm').addEventListener('submit', (e) => {
        e.preventDefault();
    
        const newItem = {
            id: products.length + 1,
            name: document.getElementById('name').value,
            price: parseFloat(document.getElementById('price').value),
            category: document.getElementById('category').value,
            quantity: parseInt(document.getElementById('quantity').value),
            lowStockAlert: parseInt(document.getElementById('lowStockAlert').value),
            image: document.getElementById('image').value
        };
    
        products.push(newItem); // Add the new product to the array
        displayProducts('all'); // Refresh product list to include the new item
        document.getElementById('modal').style.display = 'none';
        e.target.reset(); // Reset the form
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}
