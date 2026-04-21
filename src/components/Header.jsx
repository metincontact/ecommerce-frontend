import "./Header.css";
import { Link } from "react-router";

function Header({ cart, onSearch, searchQuery }) {
  let totalQuantity = 0;
  if (cart) {
    cart.forEach((cartItem) => {
      totalQuantity += cartItem.quantity;
    });
  }

  return (
    <>
      <div className="header">
        <div className="left-section">
          <Link to="/" className="header-link">
            <img className="logo" src="images/logo-white.png" alt="Logo" />
            <img className="mobile-logo" src="images/mobile-logo-white.png" alt="Logo" />
          </Link>
        </div>

        <div className="middle-section">
          <input
            className="search-bar"
            type="text"
            placeholder="Search"
            value={searchQuery ?? ""}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
          <button className="search-button">
            <img className="search-icon" src="images/icons/search-icon.png" alt="Search" />
          </button>
        </div>

        <div className="right-section">
          <Link className="orders-link header-link" to="/orders">
            <span className="orders-text">Orders</span>
          </Link>
          <Link className="cart-link header-link" to="/checkout">
            <img className="cart-icon" src="images/icons/cart-icon.png" alt="Cart" />
            <div className="cart-quantity">{totalQuantity}</div>
            <div className="cart-text">Cart</div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;
