import api from "../../api";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router";
import "./OrdersPage.css";
import Header from "../../components/Header";
import OrderHeader from "./OrderHeader";
import OrderDetails from "./OrderDetails";

function OrdersPage({ cart }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrdersData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/orders?expand=products");
      setOrders(response.data);
    } catch (err) {
      setError("Orders could not be loaded. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdersData();
  }, [fetchOrdersData]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const query = searchQuery.trim().toLowerCase();
    return orders.filter((order) =>
      order.products.some((p) => {
        const name = p?.product?.name ?? "";
        const keywords = p?.product?.keywords ?? [];
        return (
          name.toLowerCase().includes(query) ||
          keywords.some((k) => k.toLowerCase().includes(query))
        );
      })
    );
  }, [orders, searchQuery]);

  return (
    <>
      <title>Orders</title>
      <Header cart={cart} />

      <div className="orders-page">
        <div className="orders-page-header">
          <div className="page-title">Your Orders</div>
          {orders.length > 0 && (
            <div className="orders-count">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </div>
          )}
        </div>

        {orders.length > 0 && !loading && (
          <div className="orders-search-container">
            <span className="search-icon-left">🔍</span>
            <input
              type="text"
              className="orders-search-input"
              placeholder="Search your orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {error && !loading && (
          <div className="orders-error">
            <div className="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="retry-button" onClick={fetchOrdersData}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>When you place an order, it will appear here.</p>
            <Link to="/" className="shop-now-button">
              Start shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="orders-empty">
            <div className="empty-icon">🔍</div>
            <h3>No results found</h3>
            <p>No orders matching "{searchQuery}".</p>
            <button
              className="shop-now-button"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </button>
          </div>
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-container">
                <OrderHeader order={order} />
                <OrderDetails order={order} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default OrdersPage;
