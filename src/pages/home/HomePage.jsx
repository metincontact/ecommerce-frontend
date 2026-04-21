import api from "../../api";
import { useEffect, useState } from "react";
import "./HomePage.css";
import Header from "../../components/Header";
import ProductsGrid from "./ProductsGrid";

function HomePage({ cart, fetchAppData }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchHomeData() {
      const response = await api.get("/api/products");
      setProducts(response.data);
    }
    fetchHomeData();
  }, []);

  return (
    <>
      <title>Ecommerce Project</title>
      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} fetchAppData={fetchAppData} />
      </div>
    </>
  );
}

export default HomePage;
