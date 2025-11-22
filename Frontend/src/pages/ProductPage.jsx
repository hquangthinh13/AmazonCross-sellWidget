import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/api";
import Spinner from "@/components/spinner";
import ProductCard from "../components/ProductCard-horizontal";
import CarouselBanner from "../components/carousel-banner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { RotateCcw } from "lucide-react";
const SORT_OPTIONS = [
  { value: "Default", label: "Most Reviewed" }, // fallback sort
  { value: "rating-dsc", label: "Rating: High to Low" }, // average_rating DESC
  { value: "rating-asc", label: "Rating: Low to High" }, // average_rating ASC
  { value: "price-asc", label: "Price: Low to High" }, // price ASC
  { value: "price-desc", label: "Price: High to Low" }, // price DESC
];

const ProductPage = ({}) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1); // current page
  const [limit] = useState(24); // products per page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("Default");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);

        const q = params.get("q") || "";
        const page = params.get("page") || 1;
        const sort = params.get("sort") || "Default";
        const limit = 20;

        const query = new URLSearchParams({
          q,
          page,
          sort,
          limit,
        });

        const { data } = await api.get(`/search?${query.toString()}`);

        setProducts(data.products);
        setTotalPages(data.totalPages);
        setPage(Number(page));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Cleanup to cancel old fetch if effect re-runs
    return () => controller.abort();
  }, [location.search]);

  const handleSort = (option) => {
    setSortOption(option);

    const params = new URLSearchParams(location.search);

    if (option && option !== "Default") params.set("sort", option);
    else params.delete("sort");

    params.set("page", 1); // always reset page
    navigate({ search: params.toString() });
  };
  const resetFilters = () => {
    const params = new URLSearchParams(location.search);

    params.delete("sort");
    // If you also want to clear search:
    params.delete("q");

    params.set("page", 1);
    setSortOption("Default");

    navigate({ pathname: "/", search: params.toString() });
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
  // if (loading)
  //   return (
  //     <div className="w-screen h-screen flex items-center justify-center">
  //       <Spinner />
  //     </div>
  //   );
  return (
    <div className="min-h-screen ">
      <div className="px-4 max-w-4xl mx-auto w-auto">
        <div className="pt-4 mb-8">
          <CarouselBanner />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-black flex flex-col relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[3px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              Video Games{" "}
            </h1>
            {/* {!loading && ( */}
            <span className="text-xs font-light text-muted-foreground">
              Showing {products.length}{" "}
              {products.length > 1 ? "products" : "product"}
            </span>
            {/* )} */}
          </div>

          <div className="flex flex-row justify-between items-center w-full sm:w-auto">
            <div className="ml-4 flex flex-1 flex-row gap-2 items-center">
              <a className="flex text-xs uppercase text-muted-foreground whitespace-nowrap">
                Sort by
              </a>
              <Select value={sortOption} onValueChange={handleSort}>
                <SelectTrigger className="flex-1 md:w-[180px] cursor-pointer">
                  <SelectValue placeholder="Sort products" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="ml-4 cursor-pointer"
              onClick={resetFilters}
            >
              <RotateCcw />
            </Button>
          </div>
        </div>

        {loading && (
          <div className="w-full pt-16 flex justify-center">
            <Spinner />
          </div>
        )}

        {!loading && products.length > 0 && (
          <div
            key={location.search}
            className="grid mt-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="mt-6 flex justify-center items-center font-light text-center text-muted-foreground">
            No products.
          </div>
        )}

        {!loading && totalPages > 1 && (
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
                  <div className="mx-16 flex">
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
