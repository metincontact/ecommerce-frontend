import "./Header.css";
import { Link } from "react-router";

function Header({ cart, onSearch, searchQuery }) {
  const totalQuantity = cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const isSearchActive = !!onSearch;

  return (
    <header className="header">
      <div className="header-inner">
        <div className="left-section">
          <Link to="/" className="brand-link">
            <span className="brand-name">NOVA</span>
          </Link>
        </div>

        <div className={`middle-section ${!isSearchActive ? "search-disabled" : ""}`}>
          <input
            className="search-bar"
            type="text"
            placeholder={isSearchActive ? "Search products…" : "Search available on home page"}
            value={isSearchActive ? (searchQuery ?? "") : ""}
            onChange={(e) => isSearchActive && onSearch(e.target.value)}
            readOnly={!isSearchActive}
          />
          <button className="search-button" disabled={!isSearchActive}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>

        <div className="right-section">
          <Link className="nav-link" to="/orders">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <line x1="9" y1="12" x2="15" y2="12"/>
              <line x1="9" y1="16" x2="13" y2="16"/>
            </svg>
            <span>Orders</span>
          </Link>

          <Link className="nav-link cart-link" to="/checkout">
            <div className="cart-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalQuantity > 0 && (
                <span className="cart-badge">{totalQuantity > 99 ? "99+" : totalQuantity}</span>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
