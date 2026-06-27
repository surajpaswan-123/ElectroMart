import React from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;