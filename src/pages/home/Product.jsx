import api from "../../api";
import { useState, useEffect, useRef } from "react";
import { formatMoney } from "../../utils/money";

function StarRating({ stars, count }) {
  return (
    <div className="product-rating-container">
      <span
        className="product-rating-stars"
        data-testid="product-rating-stars-image"
      >
        ★ {stars.toFixed(1)}
      </span>
      <span className="product-rating-count">({count.toLocaleString()})</span>
    </div>
  );
}

function Product({ product, fetchAppData, index = 0 }) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addError, setAddError] = useState(false);
  const timeoutRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("product-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("product-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function handleAddToCart() {
    try {
      await api.post("/api/cart-items", {
        productId: product.id,
        quantity: quantity,
      });
      await fetchAppData();
      setAddedToCart(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setAddedToCart(false), 2000);
    } catch {
      setAddError(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setAddError(false), 3000);
    }
  }

  return (
    <div
      ref={cardRef}
      className="product-container"
      data-testid="product-container"
      style={{ "--card-delay": `${(index % 8) * 0.07}s` }}
    >
      <div className="product-image-container">
        <img
          className="product-image"
          data-testid="product-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
      </div>

      <div className="product-body">
        <div className="product-category">{product.keywords?.[0]}</div>
        <div className="product-name limit-text-to-2-lines">{product.name}</div>

        <StarRating stars={product.rating.stars} count={product.rating.count} />

        <div className="product-price">{formatMoney(product.priceCents)}</div>

        <div className="product-footer">
          <div className="product-quantity-container">
            <label className="qty-label">Qty</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div
            className="added-feedback"
            style={{ opacity: addedToCart || addError ? 1 : 0 }}
          >
            {addError ? "⚠ Failed" : "✓ Added"}
          </div>

          <button
            className="add-to-cart-button button-primary"
            data-testid="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={addedToCart}
          >
            {addedToCart ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
