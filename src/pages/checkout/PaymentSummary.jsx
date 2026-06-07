import { formatMoney } from "../../utils/money";
import api from "../../api";
import { useNavigate } from "react-router";
import { useState } from "react";

function PaymentSummary({ paymentSummary, fetchAppData }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  async function createOrder() {
    if (loading) return;
    try {
      setLoading(true);
      setOrderError(null);
      await api.post("/api/orders");
      await fetchAppData();
      navigate("/orders");
    } catch {
      setOrderError("Order could not be placed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="payment-summary">
      <div className="payment-summary-title">Payment Summary</div>
      {paymentSummary && (
        <>
          <div className="payment-summary-row">
            <div>Items ({paymentSummary.totalItems}):</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.productCostCents)}
            </div>
          </div>
          <div className="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.shippingCostCents)}
            </div>
          </div>
          <div className="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.totalCostBeforeTaxCents)}
            </div>
          </div>
          <div className="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.taxCents)}
            </div>
          </div>
          <div className="payment-summary-row total-row">
            <div>Order total:</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.totalCostCents)}
            </div>
          </div>

          {orderError && (
            <div className="order-error-message">{orderError}</div>
          )}

          <button
            className="place-order-button button-primary"
            onClick={createOrder}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span className="place-order-loading">
                <span className="place-order-spinner"></span>
                Placing order...
              </span>
            ) : (
              "Place your order"
            )}
          </button>
        </>
      )}
    </div>
  );
}

export default PaymentSummary;
