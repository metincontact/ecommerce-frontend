import { Link } from "react-router";
import { Fragment, useState } from "react";
import dayjs from "dayjs";
import api from "../../api";

function OrderDetails({ order }) {
  // Her ürün için "added" state'i: { [productId]: boolean }
  const [addedItems, setAddedItems] = useState({});

  async function handleBuyAgain(productId) {
    await api.post("/api/cart-items", {
      productId: productId,
      quantity: 1,
    });
    setAddedItems((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [productId]: false }));
    }, 2000);
  }

  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => {
        const isAdded = addedItems[orderProduct.product.id];

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
                onClick={() => handleBuyAgain(orderProduct.product.id)}
                disabled={isAdded}
              >
                {isAdded ? (
                  <>
                    <span style={{ marginRight: "8px" }}>✓</span>
                    <span className="buy-again-message">Added!</span>
                  </>
                ) : (
                  <>
                    <img
                      className="buy-again-icon"
                      src="images/icons/buy-again.png"
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
