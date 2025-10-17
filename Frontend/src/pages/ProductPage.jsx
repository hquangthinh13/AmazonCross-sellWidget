import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import SearchBar from "../components/searchbar";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/navbar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1); // current page
  const [limit] = useState(24); // products per page
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Default");

  const navigate = useNavigate();
  const location = useLocation();
  // 🔁 Sync state with URL on first render
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const sort = params.get("sort") || "Default";
    const p = parseInt(params.get("page")) || 1;

    setSearchQuery(q);
    setSortOption(sort);
    setPage(p);
  }, [location.search]);
  // 🔍 Fetch data
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(searchQuery && { search: searchQuery }),
        ...(sortOption && sortOption !== "Default" && { sort: sortOption }),
      });
      const res = await fetch(`http://localhost:5001/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery, sortOption]);

  // 🔄 Handlers that also update the URL
  const handleSearch = (query) => {
    const params = new URLSearchParams(location.search);
    if (query) params.set("q", query);
    else params.delete("q");
    params.set("page", 1);
    navigate({ search: params.toString() });
  };

  const handleSort = (option) => {
    const params = new URLSearchParams(location.search);
    params.set("sort", option);
    params.set("page", 1);
    navigate({ search: params.toString() });
  };

  const nextPage = () => {
    if (page < totalPages) {
      const params = new URLSearchParams(location.search);
      params.set("page", page + 1);
      navigate({ search: params.toString() });
    }
  };

  const prevPage = () => {
    if (page > 1) {
      const params = new URLSearchParams(location.search);
      params.set("page", page - 1);
      navigate({ search: params.toString() });
    }
  };
  return (
    <div className="min-h-screen  bg-accent">
      <Navbar />
      <div className="px-4 max-w-6xl mx-auto w-auto">
        <div className="mt-4">
          <SearchBar
            onSearch={handleSearch}
            onSort={handleSort}
            currentSort={sortOption}
          />{" "}
        </div>
        {products.length > 0 ? (
          <div className="grid mt-2 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No products found.
          </div>
        )}
        {totalPages > 1 && products.length === limit && (
          <div className="flex justify-center my-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="cursor-pointer"
                    onClick={prevPage}
                  />
                </PaginationItem>

                <PaginationItem>
                  <div className="flex">
                    <span className="mx-2 text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </span>
                  </div>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className="cursor-pointer"
                    onClick={nextPage}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
