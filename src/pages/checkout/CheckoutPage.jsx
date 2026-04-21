import api from "../../api";
import { useState, useEffect } from "react";
import "./CheckoutPage.css";
import "./checkout-header.css";
import { formatMoney } from "../../utils/money.js";
import dayjs from "dayjs";
import PaymentSummary from "./PaymentSummary.jsx";
import DeliveryOptions from "./DeliveryOptions.jsx";

function CheckoutPage({ cart, fetchAppData }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  useEffect(() => {
    async function fetchCheckoutData() {
      let response = await api.get(
        "/api/delivery-options?expand=estimatedDeliveryTime",
      );
      setDeliveryOptions(response.data);

      response = await api.get("/api/payment-summary");
      setPaymentSummary(response.data);
    }
    fetchCheckoutData();
  }, [cart]);

  return (
    <>
      <title>Checkout</title>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="images/logo.png" />
              <img className="mobile-logo" src="images/mobile-logo.png" />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="/">
              3 items
            </a>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {deliveryOptions.length > 0 &&
              cart.map((cartItem) => {
                const selectDeliveryOption = deliveryOptions.find(
                  (deliveryOption) => {
                    return deliveryOption.id === cartItem.deliveryOptionId;
                  },
                );

                async function deleteCartItem() {
                  await api.delete(`/api/cart-items/${cartItem.productId}`);
                  await fetchAppData();
                }

                return (
                  <div key={cartItem.productId} className="cart-item-container">
                    <div className="delivery-date">
                      Delivery date:{" "}
                      {dayjs(
                        selectDeliveryOption.estimatedDeliveryTimeMs,
                      ).format("dddd, MMMM D")}
                    </div>

                    <div className="cart-item-details-grid">
                      <img
                        className="product-image"
                        src={cartItem.product.image}
                      />

                      <div className="cart-item-details">
                        <div className="product-name">
                          {cartItem.product.name}
                        </div>
                        <div className="product-price">
                          {formatMoney(cartItem.product.priceCents)}
                        </div>
                        <div className="product-quantity">
                          <span>
                            Quantity:{" "}
                            <span className="quantity-label">
                              {cartItem.quantity}
                            </span>
                          </span>
                          <span className="update-quantity-link link-primary">
                            Update
                          </span>
                          <span
                            className="delete-quantity-link link-primary"
                            onClick={deleteCartItem}
                          >
                            Delete
                          </span>
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
