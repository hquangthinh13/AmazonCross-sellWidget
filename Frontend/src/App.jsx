import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/ProductDetailPage";
import ProductPage from "./pages/ProductPage";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  return (
    <div className="bg-accent">
      <Navbar onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/:id" element={<ProductDetail />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
