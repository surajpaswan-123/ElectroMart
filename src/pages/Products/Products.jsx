import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaMobileAlt,
  FaLaptop,
  FaHeadphones,
  FaGamepad,
  FaHome,
  FaCamera,
  FaTags,
  FaPlug,
} from "react-icons/fa";
import ProductCard from "../../components/ProductCard/ProductCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import API from "../../api/Api";
import "./Products.css";

const categoryIcons = {
  "All Products": FaThLarge,
  Smartphones: FaMobileAlt,
  Mobiles: FaMobileAlt,
  Laptops: FaLaptop,
  Audio: FaHeadphones,
  Gaming: FaGamepad,
  "Smart Home": FaHome,
  Cameras: FaCamera,
  Accessories: FaPlug,
  Deals: FaTags,
};

function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("Featured");
  const [categories, setCategories] = useState(["All Products"]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const searchQuery = params.get("search");

    setSelectedCategory(
      category
        ? category.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        : "All Products"
    );
    setSearch(searchQuery || "");
  }, [location.search]);

  useEffect(() => {
    API.get("/api/categories")
      .then((res) => {
        const names = Array.isArray(res.data)
          ? res.data.map((category) => category?.name).filter(Boolean)
          : [];
        setCategories(["All Products", ...names.filter((name) => name !== "All Products")]);
      })
      .catch((error) => {
        console.error("Unable to load categories:", error);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    API.get("/api/products")
      .then((response) => {
        // Accept the Spring Boot DTO array and common paginated/wrapped API shapes.
        const payload = response.data;
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.content)
            ? payload.content
            : Array.isArray(payload?.data)
              ? payload.data
              : null;

        if (!rows) {
          console.error("Unexpected /api/products response shape:", payload);
          setProducts([]);
          setLoadError(true);
          return;
        }

        // Normalize DB/API naming variants into the props ProductCard expects.
        setProducts(rows.map((item) => ({
          ...item,
          id: item.id ?? item.productId,
          title: item.title ?? item.name ?? "",
          brand: item.brand ?? item.manufacturer ?? "",
          image: item.image ?? item.imageUrl ?? item.image_url ?? "",
          oldPrice: item.oldPrice ?? item.old_price ?? null,
          category: item.category ?? (
            item.categoryName ? { name: item.categoryName } : null
          ),
        })));
      })
      .catch((error) => {
        console.error("Unable to load products:", error);
        setProducts([]);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const categoryName = product.category?.name || product.category || "";
    const categoryMatch =
      selectedCategory === "All Products" ||
      categoryName.toLowerCase() === selectedCategory.toLowerCase();
    const title = (product.title || product.name || "").toLowerCase();
    const brand = (product.brand || "").toLowerCase();
    const searchMatch =
      !normalizedSearch ||
      title.includes(normalizedSearch) ||
      brand.includes(normalizedSearch);
    return categoryMatch && searchMatch;
  });

  const sortedProducts = [...filteredProducts];
  if (sortOption === "Price Low To High") {
    sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOption === "Price High To Low") {
    sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  }

  const chooseCategory = (category) => {
    setSelectedCategory(category);
    if (category === "All Products") {
      navigate("/products");
    } else {
      navigate(`/products?category=${encodeURIComponent(category.toLowerCase().replace(/\s+/g, "-"))}`);
    }
  };

  return (
    <div className="products-page">
      <nav className="catalog-category-nav" aria-label="Product categories">
        {categories.map((category) => {
          const Icon = categoryIcons[category] || FaPlug;
          return (
            <button
              type="button"
              key={category}
              className={`catalog-category-item ${selectedCategory === category ? "active" : ""}`}
              onClick={() => chooseCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              <Icon aria-hidden="true" />
              <span>{category}</span>
            </button>
          );
        })}
      </nav>

      <section className="catalog-panel">
        <div className="catalog-heading-row">
          <div>
            <p className="catalog-eyebrow">ELECTROMART STORE</p>
            <h1>{selectedCategory}</h1>
            <p className="catalog-subtitle">
              {loading ? "Loading products..." : loadError ? "We couldn't connect to the product service." : `Discover products picked for you · ${sortedProducts.length} products`}
            </p>
          </div>
          <div className="catalog-controls">
            <SearchBar search={search} setSearch={setSearch} />
            <label className="catalog-sort-label">
              <span>Sort</span>
              <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
                <option>Featured</option>
                <option>Price Low To High</option>
                <option>Price High To Low</option>
              </select>
            </label>
          </div>
        </div>

        {selectedCategory !== "All Products" && (
          <div className="catalog-active-filter">
            <span>{selectedCategory}</span>
            <button type="button" onClick={() => chooseCategory("All Products")} aria-label="Clear category filter">×</button>
          </div>
        )}

        <div className="products-grid">
          {loading ? (
            <div className="catalog-message">Loading products…</div>
          ) : loadError ? (
            <div className="catalog-message">
              <strong>Products are temporarily unavailable</strong>
              <span>Check the backend/API connection and try again.</span>
              <button type="button" onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : sortedProducts.length > 0 ? (
            sortedProducts.map((product) => <ProductCard key={product.id} {...product} />)
          ) : (
            <div className="catalog-message">
              <strong>No products found</strong>
              <span>Try another category or search term.</span>
              {(search || selectedCategory !== "All Products") && (
                <button type="button" onClick={() => { setSearch(""); chooseCategory("All Products"); }}>
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products;
