import api from "../../api";
import { useState, useEffect, useCallback } from "react";
import "./CheckoutPage.css";
import "./checkout-header.css";
import { formatMoney } from "../../utils/money.js";
import dayjs from "dayjs";
import PaymentSummary from "./PaymentSummary.jsx";
import DeliveryOptions from "./DeliveryOptions.jsx";

function CheckoutPage({ cart, fetchAppData }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  // Her ürün için edit modunu tutan state: { [productId]: boolean }
  const [editingQuantity, setEditingQuantity] = useState({});
  // Her ürün için geçici quantity değeri: { [productId]: number }
  const [tempQuantity, setTempQuantity] = useState({});

  useEffect(() => {
    async function fetchCheckoutData() {
      let response = await api.get(
        "/api/delivery-options?expand=estimatedDeliveryTime"
      );
      setDeliveryOptions(response.data);

      response = await api.get("/api/payment-summary");
      setPaymentSummary(response.data);
    }
    fetchCheckoutData();
  }, [cart]);

  // Delete — useCallback ile map dışına alındı
  const deleteCartItem = useCallback(
    async (productId) => {
      await api.delete(`/api/cart-items/${productId}`);
      await fetchAppData();
    },
    [fetchAppData]
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (productId) => {
      const newQty = tempQuantity[productId];
      if (!newQty || newQty < 1) return;
      await api.put(`/api/cart-items/${productId}`, { quantity: newQty });
      await fetchAppData();
      setEditingQuantity((prev) => ({ ...prev, [productId]: false }));
    },
    [tempQuantity, fetchAppData]
  );

  // Toplam ürün adedi (hardcoded "3 items" yerine)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <title>Checkout</title>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="images/logo.png" alt="Logo" />
              <img className="mobile-logo" src="images/mobile-logo.png" alt="Logo" />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="/">
              {/* Düzeltildi: hardcoded "3 items" yerine gerçek adet */}
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </a>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" alt="Secure" />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {deliveryOptions.length > 0 &&
              cart.map((cartItem) => {
                const selectedDeliveryOption = deliveryOptions.find(
                  (d) => d.id === cartItem.deliveryOptionId
                );

                const isEditing = editingQuantity[cartItem.productId];

                return (
                  <div key={cartItem.productId} className="cart-item-container">
                    <div className="delivery-date">
                      Delivery date:{" "}
                      {dayjs(
                        selectedDeliveryOption?.estimatedDeliveryTimeMs
                      ).format("dddd, MMMM D")}
                    </div>

                    <div className="cart-item-details-grid">
                      <img
                        className="product-image"
                        src={cartItem.product.image}
                        alt={cartItem.product.name}
                      />

                      <div className="cart-item-details">
                        <div className="product-name">
                          {cartItem.product.name}
                        </div>
                        <div className="product-price">
                          {formatMoney(cartItem.product.priceCents)}
                        </div>

                        <div className="product-quantity">
                          {isEditing ? (
                            /* Edit modu */
                            <div className="quantity-edit">
                              <span className="quantity-label">Quantity: </span>
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
                            /* Normal mod */
                            <span>
                              Quantity:{" "}
                              <span className="quantity-label">
                                {cartItem.quantity}
                              </span>
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
                                Delete
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
      </div>
    </>
  );
}

export default CheckoutPage;
