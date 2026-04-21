import api from "../../api";
import { useState, useEffect } from "react";
import "./OrdersPage.css";
import Header from "../../components/Header";
import OrderHeader from "./OrderHeader";
import OrderDetails from "./OrderDetails";

function OrdersPage({ cart }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrdersData() {
      const response = await api.get("/api/orders?expand=products");
      setOrders(response.data);
    }
    fetchOrdersData();
  }, []);

  return (
    <>
      <title>Orders</title>

      <Header cart={cart} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        <div className="orders-grid">
          {orders.map((order) => {
            return (
              <div key={order.id} className="order-container">
                <OrderHeader order={order} />
                <OrderDetails order={order} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default OrdersPage;
