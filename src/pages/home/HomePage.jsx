import api from "../../api";
import { useEffect, useState, useMemo } from "react";
import "./HomePage.css";
import Header from "../../components/Header";
import ProductsGrid from "./ProductsGrid";

function HomePage({ cart, fetchAppData }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchHomeData() {
      const response = await api.get("/api/products");
      setProducts(response.data);
    }
    fetchHomeData();
  }, []);

  // Hem name hem keywords üzerinden filtrele
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const keywordMatch = product.keywords?.some((k) =>
        k.toLowerCase().includes(query)
      );
      return nameMatch || keywordMatch;
    });
  }, [products, searchQuery]);

  return (
    <>
      <title>Ecommerce Project</title>
      <Header
        cart={cart}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      <div className="home-page">
        {/* Arama sonucu boş */}
        {searchQuery && filteredProducts.length === 0 && (
          <div className="search-empty">
            <div className="search-empty-icon">🔍</div>
            <h3>No results for "{searchQuery}"</h3>
            <p>Try a different search term.</p>
            <button
              className="search-clear-button"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </button>
          </div>
        )}

        <ProductsGrid products={filteredProducts} fetchAppData={fetchAppData} />
      </div>
    </>
  );
}

export default HomePage;
