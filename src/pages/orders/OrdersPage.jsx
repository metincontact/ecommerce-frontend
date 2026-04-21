import api from "../../api";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    async function fetchOrdersData() {
      try {
        setLoading(true);
        const response = await api.get("/api/orders?expand=products");
        setOrders(response.data);
        setError(null);
      } catch (err) {
        setError("Siparişler yüklenemedi. Lütfen tekrar dene.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrdersData();
  }, []);

  // Arama filtreleme
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return order.products.some((p) =>
      p.product.name.toLowerCase().includes(query)
    );
  });

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

        {/* Arama çubuğu - sadece sipariş varsa göster */}
        {orders.length > 0 && !loading && (
          <div className="orders-search-container">
            <span className="search-icon-left">🔍</span>
            <input
              type="text"
              className="orders-search-input"
              placeholder="Siparişlerde ara..."
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
            <p>Siparişlerin yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="orders-error">
            <div className="error-icon">⚠️</div>
            <h3>Bir şeyler ters gitti</h3>
            <p>{error}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Tekrar dene
            </button>
          </div>
        )}

        {/* Empty State - Hiç sipariş yok */}
        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <div className="empty-icon">📦</div>
            <h3>Henüz siparişin yok</h3>
            <p>Sipariş verdiğinde burada görünecek.</p>
            <Link to="/" className="shop-now-button">
              Alışverişe başla
            </Link>
          </div>
        )}

        {/* Arama sonucu boş */}
        {!loading && !error && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="orders-empty">
            <div className="empty-icon">🔍</div>
            <h3>Sonuç bulunamadı</h3>
            <p>"{searchQuery}" ile eşleşen sipariş yok.</p>
            <button
              className="shop-now-button"
              onClick={() => setSearchQuery("")}
            >
              Aramayı temizle
            </button>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="orders-grid">
            {filteredOrders.map((order) => {
              return (
                <div key={order.id} className="order-container">
                  <OrderHeader order={order} />
                  <OrderDetails order={order} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default OrdersPage;
