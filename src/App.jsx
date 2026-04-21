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

  async function fetchAppData() {
    const response = await api.get("/api/cart-items?expand=product");
    setCart(response.data);
  }

  useEffect(() => {
    fetchAppData();
  }, []);

  return (
    <Routes>
      <Route
        index
        element={<HomePage cart={cart} fetchAppData={fetchAppData} />}
      />
      <Route
        path="/checkout"
        element={<CheckoutPage cart={cart} fetchAppData={fetchAppData} />}
      />
      <Route path="/orders" element={<OrdersPage cart={cart} />} />
      <Route path="/tracking/:orderId/:productId" element={<TrackingPage cart={cart} />} />
    </Routes>
  );
}

export default App;
