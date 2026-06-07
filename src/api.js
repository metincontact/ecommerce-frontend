export const BASE_URL = "https://ecommerce-backend-bbic.onrender.com";

const DUMMY_JSON_URL = "https://dummyjson.com";

const DELIVERY_OPTIONS = [
  { id: "1", priceCents: 0, daysOffset: 7 },
  { id: "2", priceCents: 499, daysOffset: 3 },
  { id: "3", priceCents: 999, daysOffset: 1 },
];

function getDeliveryOptions() {
  return DELIVERY_OPTIONS.map((opt) => ({
    id: opt.id,
    priceCents: opt.priceCents,
    estimatedDeliveryTimeMs:
      Date.now() + opt.daysOffset * 24 * 60 * 60 * 1000,
  }));
}

function roundToHalf(n) {
  return Math.round(n * 2) / 2;
}

function normalizeProduct(p) {
  return {
    id: String(p.id),
    name: p.title,
    image: p.thumbnail,
    priceCents: Math.round(p.price * 100),
    rating: { stars: roundToHalf(p.rating), count: p.reviews?.length ?? 0 },
    keywords: p.tags ?? [p.category],
  };
}

function getProductCache() {
  return JSON.parse(localStorage.getItem("productCache") ?? "{}");
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart") ?? "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getOrders() {
  return JSON.parse(localStorage.getItem("orders") ?? "[]");
}

function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function calculatePaymentSummary(cart) {
  const deliveryOptions = getDeliveryOptions();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const productCostCents = cart.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );
  const shippingCostCents = cart.reduce((sum, item) => {
    const option = deliveryOptions.find((d) => d.id === item.deliveryOptionId);
    return sum + (option?.priceCents ?? 0);
  }, 0);
  const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
  const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
  const totalCostCents = totalCostBeforeTaxCents + taxCents;
  return {
    totalItems,
    productCostCents,
    shippingCostCents,
    totalCostBeforeTaxCents,
    taxCents,
    totalCostCents,
  };
}

const api = {
  async get(url) {
    if (url.startsWith("/api/products")) {
      const res = await fetch(`${DUMMY_JSON_URL}/products?limit=0`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const json = await res.json();
      const products = json.products.map(normalizeProduct);
      const cache = {};
      products.forEach((p) => (cache[p.id] = p));
      localStorage.setItem("productCache", JSON.stringify(cache));
      return { data: products };
    }

    if (url.startsWith("/api/cart-items")) {
      return { data: getCart() };
    }

    if (url.startsWith("/api/delivery-options")) {
      return { data: getDeliveryOptions() };
    }

    if (url.startsWith("/api/payment-summary")) {
      return { data: calculatePaymentSummary(getCart()) };
    }

    if (url.startsWith("/api/orders")) {
      return { data: getOrders() };
    }

    throw new Error(`Unknown GET: ${url}`);
  },

  async post(url, data) {
    if (url === "/api/cart-items") {
      const { productId, quantity } = data;
      const product = getProductCache()[productId];
      if (!product) throw new Error(`Product ${productId} not found in cache`);

      const cart = getCart();
      const existing = cart.find((item) => item.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ productId, quantity, deliveryOptionId: "1", product });
      }
      saveCart(cart);
      return { data: {} };
    }

    if (url === "/api/orders") {
      const cart = getCart();
      if (cart.length === 0) throw new Error("Cart is empty");

      const deliveryOptions = getDeliveryOptions();
      const summary = calculatePaymentSummary(cart);

      const order = {
        id: crypto.randomUUID(),
        orderTimeMs: Date.now(),
        totalCostCents: summary.totalCostCents,
        products: cart.map((item) => {
          const option = deliveryOptions.find(
            (d) => d.id === item.deliveryOptionId,
          );
          return {
            product: item.product,
            quantity: item.quantity,
            estimatedDeliveryTimeMs:
              option?.estimatedDeliveryTimeMs ??
              Date.now() + 7 * 24 * 60 * 60 * 1000,
          };
        }),
      };

      const orders = getOrders();
      orders.unshift(order);
      saveOrders(orders);
      saveCart([]);
      return { data: order };
    }

    throw new Error(`Unknown POST: ${url}`);
  },

  async put(url, data) {
    const match = url.match(/^\/api\/cart-items\/(.+)$/);
    if (match) {
      const productId = match[1];
      const cart = getCart();
      const item = cart.find((i) => i.productId === productId);
      if (!item) throw new Error(`Cart item ${productId} not found`);
      if (data.quantity !== undefined) item.quantity = data.quantity;
      if (data.deliveryOptionId !== undefined)
        item.deliveryOptionId = data.deliveryOptionId;
      saveCart(cart);
      return { data: item };
    }

    throw new Error(`Unknown PUT: ${url}`);
  },

  async delete(url) {
    const match = url.match(/^\/api\/cart-items\/(.+)$/);
    if (match) {
      const productId = match[1];
      saveCart(getCart().filter((i) => i.productId !== productId));
      return { data: {} };
    }

    throw new Error(`Unknown DELETE: ${url}`);
  },
};

export default api;
