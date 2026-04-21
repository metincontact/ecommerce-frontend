import { Link } from "react-router";
import { Fragment } from "react";
import dayjs from "dayjs";

function OrderDetails({ order }) {
  return (
    <div className="order-details-grid">
      {order.products.map((orderProduct) => (
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
            {/* buy-again-button: global button-primary kaldırıldı, sadece component class'ı kullanılıyor */}
            <button className="buy-again-button">
              <img
                className="buy-again-icon"
                src="images/icons/buy-again.png"
                alt=""
              />
              <span className="buy-again-message">Add to Cart</span>
            </button>
          </div>

          <div className="product-actions">
            {/* Düzeltme: <Link> içinde <button> yerine Link direkt stillendirildi */}
            <Link
              to={`/tracking/${order.id}/${orderProduct.product.id}`}
              className="track-package-button"
            >
              Track package
            </Link>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default OrderDetails;
