import api from "../../api";
import { useEffect, useState, useMemo } from "react";
import "./HomePage.css";
import Header from "../../components/Header";
import ProductsGrid from "./ProductsGrid";

function HomePage({ cart, fetchAppData }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        setLoading(true);
        setError(false);
        const response = await api.get("/api/products");
        setProducts(response.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const keywordMatch = product.keywords?.some((k) =>
        k.toLowerCase().includes(query),
      );
      return nameMatch || keywordMatch;
    });
  }, [products, searchQuery]);

  return (
    <>
      <title>Ecommerce Project</title>
      <Header cart={cart} searchQuery={searchQuery} onSearch={setSearchQuery} />
      <div className="home-page">
        {loading && (
          <div className="status-message">
            <div className="spinner"></div>
            <p>Loading products...</p>
            <span className="status-hint">
              First load may take a moment while the server wakes up.
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="status-message">
            <p>Couldn't load products.</p>
            <button
              className="search-clear-button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

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

        {!loading && !error && (
          <ProductsGrid
            products={filteredProducts}
            fetchAppData={fetchAppData}
          />
        )}
      </div>
    </>
  );
}

export default HomePage;
