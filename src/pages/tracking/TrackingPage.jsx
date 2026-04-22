import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import "./TrackingPage.css";
import Header from "../../components/Header";
import api from "../../api";
import dayjs from "dayjs";

// Gerçek orderTimeMs kullanılıyor, sabit 7 gün yok
function getProgressInfo(orderTimeMs, estimatedDeliveryTimeMs) {
  const now = Date.now();

  if (now >= estimatedDeliveryTimeMs) {
    return { status: "Delivered", step: 4, percent: 100 };
  }

  const totalDuration = estimatedDeliveryTimeMs - orderTimeMs;
  const elapsed = now - orderTimeMs;
  const ratio = Math.min(Math.max(elapsed / totalDuration, 0), 1);

  if (ratio < 0.25) {
    return { status: "Preparing", step: 1, percent: Math.round(ratio * 100) };
  } else if (ratio < 0.6) {
    return { status: "Shipped", step: 2, percent: Math.round(ratio * 100) };
  } else {
    return { status: "Out for Delivery", step: 3, percent: Math.round(ratio * 100) };
  }
}

const STEPS = ["Preparing", "Shipped", "Out for Delivery", "Delivered"];

function TrackingPage({ cart }) {
  const { orderId, productId } = useParams();
  const [orderProduct, setOrderProduct] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await api.get(`/api/orders?expand=products`);
        const orders = response.data;

        const foundOrder = orders.find((o) => o.id === orderId);
        if (!foundOrder) throw new Error("Order not found");

        const foundProduct = foundOrder.products.find(
          (p) => p.product.id === productId
        );
        if (!foundProduct) throw new Error("Product not found in order");

        setOrder(foundOrder);
        setOrderProduct(foundProduct);
      } catch (err) {
        setError(err.message || "Could not load tracking info.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [orderId, productId]);

  // order.orderTimeMs artık kullanılıyor
  const progressInfo =
    orderProduct && order
      ? getProgressInfo(order.orderTimeMs, orderProduct.estimatedDeliveryTimeMs)
      : null;

  return (
    <>
      <title>Track Package</title>
      <Header cart={cart} />

      <div className="tracking-page">

        {loading && (
          <div className="tracking-loading">
            <div className="tracking-spinner"></div>
            <p>Loading tracking info...</p>
          </div>
        )}

        {error && !loading && (
          <div className="tracking-error">
            <div className="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <Link to="/orders" className="back-to-orders-link">
              Back to Orders
            </Link>
          </div>
        )}

        {!loading && !error && orderProduct && progressInfo && (
          <div className="order-tracking">

            <Link to="/orders" className="back-to-orders-link">
              View all orders
            </Link>

            <div className="tracking-header">
              <div className="delivery-date">
                {progressInfo.status === "Delivered"
                  ? "Delivered!"
                  : `Arriving on ${dayjs(orderProduct.estimatedDeliveryTimeMs).format("dddd, MMMM D")}`}
              </div>
              <div className="tracking-status-badge" data-step={progressInfo.step}>
                {progressInfo.status}
              </div>
            </div>

            <div className="product-info product-info-name">
              {orderProduct.product.name}
            </div>
            <div className="product-info">
              Quantity: {orderProduct.quantity}
            </div>
            {order && (
              <div className="product-info order-id-info">
                Order ID: <span>{order.id}</span>
              </div>
            )}

            <img
              className="product-image"
              src={orderProduct.product.image}
              alt={orderProduct.product.name}
            />

            <div className="progress-steps">
              {STEPS.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = progressInfo.step > stepNumber;
                const isCurrent = progressInfo.step === stepNumber;
                const isPending = progressInfo.step < stepNumber;

                return (
                  <div
                    key={step}
                    className={`progress-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isPending ? "pending" : ""}`}
                  >
                    <div className="step-dot">
                      {isCompleted && <span className="step-check">✓</span>}
                      {isCurrent && <span className="step-pulse"></span>}
                    </div>
                    <div className="step-connector"></div>
                    <div className="step-label">{step}</div>
                  </div>
                );
              })}
            </div>

            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progressInfo.percent}%` }}
              ></div>
            </div>
            <div className="progress-percent">{progressInfo.percent}% complete</div>

            <div className="tracking-footer">
              <div className="tracking-footer-item">
                <span className="footer-icon">📅</span>
                <div>
                  <div className="footer-label">Estimated Delivery</div>
                  <div className="footer-value">
                    {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMMM D, YYYY")}
                  </div>
                </div>
              </div>
              <div className="tracking-footer-item">
                <span className="footer-icon">🧾</span>
                <div>
                  <div className="footer-label">Order Placed</div>
                  <div className="footer-value">
                    {order ? dayjs(order.orderTimeMs).format("MMMM D, YYYY") : "—"}
                  </div>
                </div>
              </div>
              <div className="tracking-footer-item">
                <span className="footer-icon">💰</span>
                <div>
                  <div className="footer-label">Order Total</div>
                  <div className="footer-value footer-value-green">
                    {order ? `$${(order.totalCostCents / 100).toFixed(2)}` : "—"}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default TrackingPage;
