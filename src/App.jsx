import { Routes, Route } from "react-router";
import api from "./api";
import "./App.css";
import HomePage from "./pages/home/HomePage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrdersPage from "./pages/orders/OrdersPage";
import TrackingPage from "./pages/tracking/TrackingPage";
import { useEffect, useState } from "react";

function App() {
  const [cart, setCart] = useState([]);
  const [cartError, setCartError] = useState(false);

  async function fetchAppData() {
    try {
      const response = await api.get("/api/cart-items?expand=product");
      setCart(response.data);
      setCartError(false);
    } catch {
      setCartError(true);
    }
  }

  useEffect(() => {
    fetchAppData();
  }, []);

  return (
    <>
      {cartError && (
        <div className="cart-load-error">
          Sepet yüklenemedi.{" "}
          <button className="cart-error-retry" onClick={fetchAppData}>
            Tekrar dene
          </button>
        </div>
      )}
      <Routes>
        <Route
          index
          element={<HomePage cart={cart} fetchAppData={fetchAppData} />}
        />
        <Route
          path="/checkout"
          element={<CheckoutPage cart={cart} fetchAppData={fetchAppData} />}
        />
        <Route
          path="/orders"
          element={<OrdersPage cart={cart} fetchAppData={fetchAppData} />}
        />
        <Route
          path="/tracking/:orderId/:productId"
          element={<TrackingPage cart={cart} />}
        />
      </Routes>
    </>
  );
}

export default App;
