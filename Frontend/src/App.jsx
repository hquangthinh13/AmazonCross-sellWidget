import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/ProductDetailPage";
import ProductPage from "./pages/ProductPage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
};

export default App;
