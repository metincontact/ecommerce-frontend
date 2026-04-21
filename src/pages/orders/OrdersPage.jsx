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
      // Veri yapısını görmek için — sorunu bulduktan sonra bu satırı sil
      console.log("Orders data:", JSON.stringify(response.data[0], null, 2));
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

  // useMemo ile gereksiz yeniden hesaplama önleniyor
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    const query = searchQuery.toLowerCase();
    return orders.filter((order) =>
      order.products.some((p) => {
        // API yapısına göre hem p.product.name hem p.name'i dene
        const name = p?.product?.name ?? p?.name ?? "";
        return name.toLowerCase().includes(query);
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

        {/* Search bar - only shown when there are orders */}
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

        {/* Loading State */}
        {loading && (
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="orders-error">
            <div className="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            {/* window.location.reload() yerine fetchOrdersData çağrılıyor */}
            <button
              className="retry-button"
              onClick={fetchOrdersData}
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State - No orders */}
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

        {/* No search results */}
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

        {/* Orders List */}
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
