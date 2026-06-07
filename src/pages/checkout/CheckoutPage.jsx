import api from "../../api";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import "./CheckoutPage.css";
import "./checkout-header.css";
import { formatMoney } from "../../utils/money.js";
import dayjs from "dayjs";
import PaymentSummary from "./PaymentSummary.jsx";
import DeliveryOptions from "./DeliveryOptions.jsx";

function CheckoutPage({ cart, fetchAppData }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState({});
  const [tempQuantity, setTempQuantity] = useState({});
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    async function fetchDeliveryOptions() {
      try {
        const response = await api.get(
          "/api/delivery-options?expand=estimatedDeliveryTime",
        );
        setDeliveryOptions(response.data);
      } catch {
        setCheckoutError("Delivery options could not be loaded.");
      }
    }
    fetchDeliveryOptions();
  }, []);

  useEffect(() => {
    if (cart.length === 0) return;
    async function fetchPaymentSummary() {
      try {
        const response = await api.get("/api/payment-summary");
        setPaymentSummary(response.data);
      } catch {
        setCheckoutError("Payment summary could not be loaded.");
      }
    }
    fetchPaymentSummary();
  }, [cart]);

  const deleteCartItem = useCallback(
    async (productId) => {
      await api.delete(`/api/cart-items/${productId}`);
      await fetchAppData();
    },
    [fetchAppData],
  );

  const updateQuantity = useCallback(
    async (productId) => {
      const newQty = tempQuantity[productId];
      if (!newQty || newQty < 1) return;
      await api.put(`/api/cart-items/${productId}`, { quantity: newQty });
      await fetchAppData();
      setEditingQuantity((prev) => ({ ...prev, [productId]: false }));
    },
    [tempQuantity, fetchAppData],
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <title>Checkout — NOVA</title>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link to="/" className="checkout-brand-link">
              <span className="checkout-brand-name">NOVA</span>
            </Link>
          </div>

          <div className="checkout-header-middle-section">
            <span className="checkout-title-text">Checkout</span>
            <span className="checkout-item-count">
              (<Link className="return-to-home-link" to="/">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </Link>)
            </span>
          </div>

          <div className="checkout-header-right-section">
            <span className="checkout-secure-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Secure Checkout
            </span>
          </div>
        </div>
      </div>

      <div className="checkout-page">
        {checkoutError && (
          <div className="checkout-error-banner">{checkoutError}</div>
        )}

        {cart.length === 0 ? (
          <div className="checkout-empty">
            <div className="checkout-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/" className="checkout-shop-button">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="page-title">Review your order</div>

            <div className="checkout-grid">
              <div className="order-summary">
                {deliveryOptions.length > 0 &&
                  cart.map((cartItem) => {
                    const selectedDeliveryOption = deliveryOptions.find(
                      (d) => d.id === cartItem.deliveryOptionId,
                    );
                    const isEditing = editingQuantity[cartItem.productId];

                    return (
                      <div key={cartItem.productId} className="cart-item-container">
                        <div className="delivery-date">
                          Delivery by{" "}
                          {dayjs(selectedDeliveryOption?.estimatedDeliveryTimeMs).format("dddd, MMMM D")}
                        </div>

                        <div className="cart-item-details-grid">
                          <img
                            className="product-image"
                            src={cartItem.product.image}
                            alt={cartItem.product.name}
                          />

                          <div className="cart-item-details">
                            <div className="product-name">{cartItem.product.name}</div>
                            <div className="product-price">
                              {formatMoney(cartItem.product.priceCents)}
                            </div>

                            <div className="product-quantity">
                              {isEditing ? (
                                <div className="quantity-edit">
                                  <span className="quantity-label">Qty: </span>
                                  <select
                                    className="quantity-select"
                                    value={tempQuantity[cartItem.productId] ?? cartItem.quantity}
                                    onChange={(e) =>
                                      setTempQuantity((prev) => ({
                                        ...prev,
                                        [cartItem.productId]: Number(e.target.value),
                                      }))
                                    }
                                  >
                                    {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                                      <option key={n} value={n}>{n}</option>
                                    ))}
                                  </select>
                                  <span
                                    className="update-quantity-link link-primary"
                                    onClick={() => updateQuantity(cartItem.productId)}
                                  >
                                    Update
                                  </span>
                                  <span
                                    className="update-quantity-link link-primary"
                                    onClick={() =>
                                      setEditingQuantity((prev) => ({
                                        ...prev,
                                        [cartItem.productId]: false,
                                      }))
                                    }
                                  >
                                    Cancel
                                  </span>
                                </div>
                              ) : (
                                <span>
                                  Qty:{" "}
                                  <span className="quantity-label">{cartItem.quantity}</span>
                                  <span
                                    className="update-quantity-link link-primary"
                                    onClick={() => {
                                      setTempQuantity((prev) => ({
                                        ...prev,
                                        [cartItem.productId]: cartItem.quantity,
                                      }));
                                      setEditingQuantity((prev) => ({
                                        ...prev,
                                        [cartItem.productId]: true,
                                      }));
                                    }}
                                  >
                                    Update
                                  </span>
                                  <span
                                    className="delete-quantity-link link-primary"
                                    onClick={() => deleteCartItem(cartItem.productId)}
                                  >
                                    Remove
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>

                          <DeliveryOptions
                            deliveryOptions={deliveryOptions}
                            cartItem={cartItem}
                            fetchAppData={fetchAppData}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <PaymentSummary
                paymentSummary={paymentSummary}
                fetchAppData={fetchAppData}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CheckoutPage;
