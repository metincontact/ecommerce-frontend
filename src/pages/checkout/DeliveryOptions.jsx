import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";
import api from "../../api";

function DeliveryOptions({ deliveryOptions, cartItem, fetchAppData }) {
  async function updateDeliveryOption(deliveryOptionId) {
    try {
      await api.put(`/api/cart-items/${cartItem.productId}`, {
        deliveryOptionId,
      });
      await fetchAppData();
    } catch {
      console.error("Failed to update delivery option.");
    }
  }

  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>

      {deliveryOptions.map((deliveryOption) => {
        const priceString =
          deliveryOption.priceCents > 0
            ? `${formatMoney(deliveryOption.priceCents)} - Shipping`
            : "FREE Shipping";

        return (
          <div
            key={deliveryOption.id}
            className="delivery-option"
            onClick={() => updateDeliveryOption(deliveryOption.id)}
          >
            <input
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              onChange={() => {}}
              className="delivery-option-input"
              name={`delivery-option-${cartItem.productId}`}
            />

            <div>
              <div className="delivery-option-date">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D",
                )}
              </div>
              <div className="delivery-option-price">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DeliveryOptions;
