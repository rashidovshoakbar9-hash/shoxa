
const products = [
    {
        id: 1,
        name: "ASUS VivoBook 15",
        category: "laptop",
        price: 6500000,
        specs: "Intel Core i5 • 8GB RAM • 512GB SSD",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
        tag: "Ommabop"
    },
    {
        id: 2,
        name: "MacBook Air M2",
        category: "laptop",
        price: 12500000,
        specs: "Apple M2 • 8GB RAM • 256GB SSD",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        tag: "Premium"
    },
    {
        id: 3,
        name: "Lenovo IdeaPad 3",
        category: "laptop",
        price: 5200000,
        specs: "AMD Ryzen 5 • 8GB RAM • 512GB SSD",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
        tag: "Tejamkor"
    },
    {
        id: 4,
        name: "HP Pavilion 15",
        category: "laptop",
        price: 7800000,
        specs: "Intel Core i7 • 16GB RAM • 512GB SSD",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
        tag: "Kuchli"
    },
    {
        id: 5,
        name: "Gaming PC RGB",
        category: "computer",
        price: 11500000,
        specs: "Ryzen 5 • 16GB RAM • 1TB SSD",
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
        tag: "Gaming"
    },
    {
        id: 6,
        name: "Office PC",
        category: "computer",
        price: 4500000,
        specs: "Intel Core i3 • 8GB RAM • 256GB SSD",
        image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80",
        tag: "Tejamkor"
    },
    {
        id: 7,
        name: "Professional PC",
        category: "computer",
        price: 14500000,
        specs: "Intel Core i7 • 32GB RAM • 1TB SSD",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80",
        tag: "Professional"
    },
    {
        id: 8,
        name: "Gaming Laptop",
        category: "laptop",
        price: 13500000,
        specs: "Intel Core i7 • 16GB RAM • RTX grafikasi",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
        tag: "Gaming"
    }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const emptyMessage = document.getElementById("emptyMessage");

let selectedCategory = "all";
let cart = [];

const formatPrice = (price) =>
    price.toLocaleString("uz-UZ") + " so‘m";

function renderProducts() {
    let filtered = products.filter(product => {
        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(
                searchInput.value.trim().toLowerCase()
            ) ||
            product.specs.toLowerCase().includes(
                searchInput.value.trim().toLowerCase()
            );

        return matchesCategory && matchesSearch;
    });

    if (sortSelect.value === "low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortSelect.value === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    productGrid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400/171d33/ffffff?text=TechZone'">
                <span class="product-tag">${product.tag}</span>
            </div>

            <div class="product-info">
                <span class="product-category">
                    ${product.category === "laptop" ? "Noutbuk" : "Stol kompyuteri"}
                </span>

                <h3>${product.name}</h3>
                <p class="specs">${product.specs}</p>

                <div class="product-bottom">
                    <span class="price">${formatPrice(product.price)}</span>
                    <button class="add-button" data-add="${product.id}">
                        + Savatga
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    emptyMessage.hidden = filtered.length > 0;
}

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".filter.active")
            ?.classList.remove("active");

        button.classList.add("active");
        selectedCategory = button.dataset.category;
        renderProducts();
    });
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (!button) return;

    const id = Number(button.dataset.add);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, quantity: 1 });
    }

    renderCart();

    button.textContent = "✓ Qo‘shildi";
    setTimeout(() => {
        if (button.isConnected) button.textContent = "+ Savatga";
    }, 900);
});

const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + product.price * item.quantity;
    }, 0);

    cartCount.textContent = count;
    cartTotal.textContent = formatPrice(total);

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        return `
            <div class="cart-item">
                <div>
                    <h4>${product.name}</h4>
                    <p>${formatPrice(product.price * item.quantity)}</p>
                    <div class="quantity-controls">
                        <button data-action="minus" data-id="${item.id}">−</button>
                        <span>${item.quantity}</span>
                        <button data-action="plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-button"
                    data-action="remove" data-id="${item.id}">
                    O‘chirish
                </button>
            </div>
        `;
    }).join("");
}

document.getElementById("cartButton").addEventListener("click", () => {
    cartModal.classList.add("open");
    cartModal.setAttribute("aria-hidden", "false");
});

function closeCart() {
    cartModal.classList.remove("open");
    cartModal.setAttribute("aria-hidden", "true");
}

document.getElementById("closeCart").addEventListener("click", closeCart);

cartModal.addEventListener("click", event => {
    if (event.target === cartModal) closeCart();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
});

cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const item = cart.find(product => product.id === id);

    if (!item) return;

    switch (button.dataset.action) {
        case "plus":
            item.quantity++;
            break;

        case "minus":
            item.quantity--;
            if (item.quantity <= 0) {
                cart = cart.filter(product => product.id !== id);
            }
            break;

        case "remove":
            cart = cart.filter(product => product.id !== id);
            break;
    }

    renderCart();
});

document.getElementById("clearCart").addEventListener("click", () => {
    cart = [];
    renderCart();
});

renderProducts();
renderCart();
