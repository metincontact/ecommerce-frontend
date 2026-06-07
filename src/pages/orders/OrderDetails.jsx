import { Link } from "react-router";
import { Fragment, useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import api, { BASE_URL } from "../../api";

function OrderDetails({ order, fetchAppData }) {
  const [addedItems, setAddedItems] = useState({});
  const [errorItems, setErrorItems] = useState({});
  const timeoutsRef = useRef({});

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

  async function handleBuyAgain(productId, quantity) {
    try {
      await api.post("/api/cart-items", {
        productId,
        quantity,
      });

      if (fetchAppData) await fetchAppData();

      setAddedItems((prev) => ({ ...prev, [productId]: true }));
      clearTimeout(timeoutsRef.current[productId]);
      timeoutsRef.current[productId] = setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
    } catch {
      setErrorItems((prev) => ({ ...prev, [productId]: true }));
      clearTimeout(timeoutsRef.current[productId]);
      timeoutsRef.current[productId] = setTimeout(() => {
        setErrorItems((prev) => ({ ...prev, [productId]: false }));
      }, 3000);
    }
  }

  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {
        const isAdded = addedItems[orderProduct.product.id];
        const isError = errorItems[orderProduct.product.id];

        return (
          <Fragment key={orderProduct.product.id}>
            <div className="product-image-container">
              <img
                src={orderProduct.product.image}
                alt={orderProduct.product.name}
              />
            </div>

            <div className="product-details">
              <div className="product-name">{orderProduct.product.name}</div>
              <div className="product-delivery-date">
                Arriving on:{" "}
                {dayjs(orderProduct.estimatedDeliveryTimeMs).format("MMMM D")}
              </div>
              <div className="product-quantity">
                Quantity: {orderProduct.quantity}
              </div>
              <button
                className="buy-again-button"
                onClick={() =>
                  handleBuyAgain(orderProduct.product.id, orderProduct.quantity)
                }
                disabled={isAdded}
              >
                {isAdded ? (
                  <>
                    <span style={{ marginRight: "8px" }}>✓</span>
                    <span className="buy-again-message">Added!</span>
                  </>
                ) : isError ? (
                  <span className="buy-again-message">Failed. Try again.</span>
                ) : (
                  <>
                    <img
                      className="buy-again-icon"
                      src={`${BASE_URL}/images/icons/buy-again.png`}
                      alt=""
                    />
                    <span className="buy-again-message">Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            <div className="product-actions">
              <Link
                to={`/tracking/${order.id}/${orderProduct.product.id}`}
                className="track-package-button"
              >
                Track package
              </Link>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

export default OrderDetails;
