import { useState, useContext, useMemo, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";
import SearchFilter from "../components/SearchFilter";
import "./Home.css";

function Home() {
  // ✅ CORRECT: Fetch products from backend API
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("none");

  // ✅ CORRECT: Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8000/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setDisplayedProducts(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ❌ OLD: Used hardcoded products from data/products.js
  // const [displayedProducts] = useState(products);

  const filteredProducts = useMemo(() => {
    let result = displayedProducts.filter((product) =>
      product.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return result;
  }, [displayedProducts, searchKeyword, selectedCategory, sortBy]);

  return (
    <main className="home">
      <div className="container">
        <section className="hero">
          <h1>Welcome to MyShop</h1>
          <p>Leading electronics store - Quality products, best prices</p>
          <button className="btn-primary">Explore Products</button>
        </section>

        <SearchFilter
          onSearch={setSearchKeyword}
          onFilterChange={setSelectedCategory}
          onSortChange={setSortBy}
        />

        <section className="products-section">
          <div className="section-header">
            <h2>
              Featured Products
              <span className="result-count">({filteredProducts.length} products)</span>
            </h2>
            <p>Explore the best technology products available</p>
          </div>

          {isLoading && <p style={{ textAlign: "center" }}>Loading products...</p>}
          {error && <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>}

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        <section className="stats">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Products</p>
          </div>

          <div className="stat-item">
            <h3>50K+</h3>
            <p>Customers</p>
          </div>

          <div className="stat-item">
            <h3>24/7</h3>
            <p>Support</p>
          </div>

          <div className="stat-item">
            <h3>100%</h3>
            <p>Authentic</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
