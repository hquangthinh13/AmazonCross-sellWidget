import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import api from "../lib/api";

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchInput(q);
  }, [location.search]);

  // apply URL update
  const navigateSearch = (query) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", 1);

    navigate({
      pathname: "/",
      search: params.toString(),
    });
  };

  const handleSearchClick = () => {
    setSubmitted(true);
    navigateSearch(searchInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearchClick();
  };

  const handleSuggestionClick = (kw) => {
    setSubmitted(true);
    navigateSearch(kw);
  };

  // Fetch suggestions (dedicated API)
  useEffect(() => {
    if (submitted) return setSuggestions([]);

    const q = searchInput.trim();
    if (!q || q.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `/search/suggestions?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        setSuggestions(data.suggestions || []);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchInput, submitted]);

  return (
    <div className="relative hidden md:flex flex-row md:w-sm lg:w-md items-center gap-2">
      <div className="flex max-w-3xl w-full focus-within:ring-1 rounded-sm overflow-hidden">
        <Input
          value={searchInput}
          onChange={(e) => {
            setSubmitted(false);
            setSearchInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="rounded-none bg-white text-sm"
        />

        <Button
          variant="secondary"
          size="icon"
          onClick={handleSearchClick}
          className="rounded-none cursor-pointer"
        >
          <Search />
        </Button>
      </div>
      <div>
        {/* Suggestions */}
        {!submitted && suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border shadow z-20">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>{" "}
    </div>
  );
};

export default SearchBar;
