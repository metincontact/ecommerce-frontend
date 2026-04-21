import api from "../../api";
import { useState } from "react";
import { formatMoney } from "../../utils/money";

function Product({ product, fetchAppData }) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  async function handleAddToCart() {
    await api.post("/api/cart-items", {
      productId: product.id,
      quantity: quantity,
    });
    await fetchAppData();

    // Animasyonu tetikle
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="product-container" data-testid="product-container">
      <div className="product-image-container">
        <img
          className="product-image"
          data-testid="product-image"
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-name limit-text-to-2-lines">{product.name}</div>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={`images/ratings/rating-${product.rating.stars * 10}.png`}
          alt={`${product.rating.stars} stars`}
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">{formatMoney(product.priceCents)}</div>

      <div className="product-quantity-container">
        <select
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        >
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="product-spacer"></div>

      {/* Animasyon: addedToCart true olunca görünür */}
      <div
        className="added-to-cart"
        style={{ opacity: addedToCart ? 1 : 0, transition: "opacity 0.3s ease" }}
      >
        <img src="images/icons/checkmark.png" alt="" />
        Added
      </div>

      <button
        className="add-to-cart-button button-primary"
        data-testid="add-to-cart-button"
        onClick={handleAddToCart}
        disabled={addedToCart}
      >
        {addedToCart ? "Added!" : "Add to Cart"}
      </button>
    </div>
  );
}

export default Product;
