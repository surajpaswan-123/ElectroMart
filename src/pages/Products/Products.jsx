import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import API from "../../api/Api";
import "./Products.css";

function Products() {
  const location = useLocation();
 const [products, setProducts] =
  useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All Products");

  const [search, setSearch] = useState("");

  const [sortOption, setSortOption] =
    useState("Featured");

  useEffect(() => {
    const params = new URLSearchParams(
      location.search
    );

    // Category Read
    const category = params.get("category");

    if (category) {
      const formattedCategory = category
        .split("-")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ");

      setSelectedCategory(formattedCategory);
    } else {
      setSelectedCategory("All Products");
    }

    // Search Read
    const searchQuery = params.get("search");

    if (searchQuery) {
      setSearch(searchQuery);
    } else {
      setSearch("");
    }
  }, [location.search]);

  const [categories, setCategories] = useState(["All Products"]);

  useEffect(() => {
    API.get("/api/categories")
      .then((res) => {
        const names = Array.isArray(res.data)
          ? res.data
              .map((c) => c?.name)
              .filter(Boolean)
          : [];
        setCategories(["All Products", ...names]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const filteredProducts =
    products.filter(
      (product) => {

      const categoryMatch =
        selectedCategory ===
        "All Products"
          ? true
          : product.category?.name ===
            selectedCategory;

      const searchMatch =
        product.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        product.brand
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        categoryMatch &&
        searchMatch
      );
    }
  );

  if (
    sortOption ===
    "Price Low To High"
  ) {
    filteredProducts.sort(
      (a, b) => a.price - b.price
    );
  }

  if (
    sortOption ===
    "Price High To Low"
  ) {
    filteredProducts.sort(
      (a, b) => b.price - a.price
    );
  }
  useEffect(() => {
    API.get("/api/products")
      .then((response) => {
        setProducts(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error(error);
        setProducts([]);
      });
  }, []);

  return (
    <div className="products-page">
      <div className="breadcrumb">
        Home / {selectedCategory}
      </div>

      <div className="products-layout">
        <aside className="sidebar">
          <h3>Category</h3>

          <ul>
            {categories.map(
              (category) => (
                <li
                  key={category}
                  className={
                    selectedCategory ===
                    category
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  {category}
                </li>
              )
            )}
          </ul>
        </aside>

        <div className="products-content">
          <div className="products-top">
            <div>
              <h1>
                {selectedCategory}
              </h1>

              <p>
                {
                  filteredProducts.length
                }{" "}
                Products
              </p>

              <span className="filter-tag">
                {selectedCategory}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems:
                  "center",
              }}
            >
              <SearchBar
                search={search}
                setSearch={setSearch}
              />

              <select
                value={sortOption}
                onChange={(e) =>
                  setSortOption(
                    e.target.value
                  )
                }
              >
                <option>
                  Featured
                </option>

                <option>
                  Price Low To High
                </option>

                <option>
                  Price High To Low
                </option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.length >
            0 ? (
              filteredProducts.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
                )
              )
            ) : (
              <div className="no-products">
                No Products Found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;