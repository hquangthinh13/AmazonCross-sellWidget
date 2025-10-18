import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/api";

import SearchBar from "../components/searchbar";
import ProductCard from "../components/ProductCard";
import CarouselBanner from "../components/carousel-banner";
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

  // 🔍 Fetch data

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const currentPage = parseInt(params.get("page")) || 1;
        const limit = 20;
        const searchQuery = params.get("q") || "";
        const sortOption = params.get("sort") || "Default";

        const query = new URLSearchParams({
          page: currentPage,
          limit,
          ...(searchQuery && { search: searchQuery }),
          ...(sortOption && sortOption !== "Default" && { sort: sortOption }),
        });
        // const res = await fetch(`http://localhost:5001/api/products?${query}`);
        const { data } = await api.get(`/products?${query}`);

        setProducts(data.products);
        setTotalPages(data.totalPages);
        setPage(currentPage);
        setSearchQuery(searchQuery);
        setSortOption(sortOption);
        console.log("Current Page:", currentPage);
        console.log("Search Query:", searchQuery);
        console.log("Sort Option:", sortOption);
        console.log("Products:", data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
    // Cleanup to cancel old fetch if effect re-runs
    return () => controller.abort();
  }, [location.search]);

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
    <div className="min-h-screen bg-accent">
      <Navbar />
      <div className="px-4 max-w-7xl mx-auto w-auto">
        <div className="mt-4 mb-8">
          <CarouselBanner />
        </div>
        <span className="flex flex-col sm:flex-row justify-between items-baseline">
          <h1 className="text-4xl font-semibold text-black mb-2">
            Video Games
          </h1>
          <span className="text-xs text-muted-foreground">
            Showing {products.length} of {totalPages * limit} products
          </span>
        </span>
        <div className="mt-2 mb-4">
          <SearchBar
            onSearch={handleSearch}
            onSort={handleSort}
            currentSort={sortOption}
          />{" "}
        </div>

        {products.length > 0 ? (
          <div
            key={location.search}
            className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No products found.
          </div>
        )}
        {totalPages > 1 && (
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
                      {page} / {totalPages}
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
