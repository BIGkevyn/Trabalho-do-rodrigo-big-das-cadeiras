const products = [
  {
    id: 1,
    name: "Cadeira de Rodas Comfort",
    category: "Manual",
    description: "Conforto e praticidade para o dia a dia.",
    price: 899.90,
    tag: "Mais vendida",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 2,
    name: "Cadeira Dobrável Plus",
    category: "Dobrável",
    description: "Praticidade para transportar e guardar.",
    price: 1099.90,
    tag: "Prática",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 3,
    name: "Cadeira de Rodas Premium",
    category: "Conforto",
    description: "Uma opção para quem busca mais conforto.",
    price: 1499.90,
    tag: "Premium",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 4,
    name: "Cadeira de Rodas Reforçada",
    category: "Resistente",
    description: "Consulte as especificações e capacidades.",
    price: 1299.90,
    tag: "Resistente",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=650&q=80"
  }
];

// Configure com o número real da loja, incluindo código do país.
// Exemplo de formato brasileiro: 5541999999999
const WHATSAPP_NUMBER = "5500000000000";

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartDialog = document.getElementById("cartDialog");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

let cart = [];
let toastTimeout;

const money = value => value.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function renderProducts() {
  productGrid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x450/eaf3ff/1265d8?text=Cadeira+de+Rodas'"
        >
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <strong class="product-price">${money(product.price)}</strong>
        <button class="add-cart" data-add="${product.id}">
          + Adicionar ao carrinho
        </button>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  showToast(`${product.name} adicionado ao carrinho!`);
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += amount;
  cart = cart.filter(product => product.quantity > 0);
  updateCart();
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  cartCount.textContent = count;
  cartTotal.textContent = money(total);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <div style="font-size:40px;margin-bottom:10px">🛒</div>
        <p>Seu carrinho está vazio.</p>
        <small>Escolha um produto para começar!</small>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <small>${money(item.price)} cada</small>
      </div>
      <div class="quantity-controls">
        <button data-minus="${item.id}" aria-label="Diminuir quantidade">−</button>
        <span>${item.quantity}</span>
        <button data-plus="${item.id}" aria-label="Aumentar quantidade">+</button>
      </div>
    </div>
  `).join("");
}

function openWhatsApp(message) {
  if (!/^\d{12,15}$/.test(WHATSAPP_NUMBER) ||
      WHATSAPP_NUMBER === "5500000000000") {
    showToast("Configure o número real do WhatsApp no script.js.");
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Produtos e carrinho
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");

  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
});

document.getElementById("cartButton").addEventListener("click", () => {
  cartDialog.showModal();
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartDialog.close();
});

cartDialog.addEventListener("click", event => {
  if (event.target === cartDialog) cartDialog.close();
});

document.getElementById("clearCart").addEventListener("click", () => {
  cart = [];
  updateCart();
  showToast("Carrinho limpo.");
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Adicione um produto antes de finalizar.");
    return;
  }

  const lines = cart.map(item =>
    `- ${item.name} x${item.quantity} — ${money(item.price * item.quantity)}`
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const message = [
    "Olá! Vim pelo site da Big das Cadeiras e gostaria de consultar estes produtos:",
    "",
    ...lines,
    "",
    `Total estimado: ${money(total)}`,
    "",
    "Gostaria de confirmar disponibilidade, frete e formas de pagamento."
  ].join("\n");

  openWhatsApp(message);
});

// Modo claro e escuro
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function setTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark", isDark);
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Ativar modo claro" : "Ativar modo escuro"
  );
  themeToggle.title = isDark ? "Ativar modo claro" : "Ativar modo escuro";

  try {
    localStorage.setItem("bigCadeirasTheme", theme);
  } catch (error) {
    // O tema continua funcionando mesmo se o navegador bloquear armazenamento.
  }
}

let savedTheme = null;

try {
  savedTheme = localStorage.getItem("bigCadeirasTheme");
} catch (error) {
  // Usa o tema claro como padrão.
}

setTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark")
    ? "light"
    : "dark";

  setTheme(nextTheme);
});

// Menu para celulares
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.textContent = isOpen ? "✕" : "☰";
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu" : "Abrir menu"
  );
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

// Contato da loja
document.getElementById("contactButton").addEventListener("click", event => {
  if (WHATSAPP_NUMBER === "5500000000000") {
    event.preventDefault();
    showToast("Configure o número real do WhatsApp no script.js.");
    return;
  }

  event.currentTarget.href =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent("Olá! Gostaria de saber mais sobre as cadeiras de rodas.");
});

// Inicialização
document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
updateCart();