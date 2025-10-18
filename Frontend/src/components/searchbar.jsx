import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, ArrowDownUp } from "lucide-react";

const SearchBar = ({ onSearch, onSort, currentSort, searchQuery }) => {
  const [searchInput, setSearchInput] = useState(searchQuery || "");

  useEffect(() => {
    setSearchInput(searchQuery ?? "");
  }, [searchQuery]);

  const sortOptions = [
    { value: "default", label: "Default Order" },
    { value: "rating-dsc", label: "Rating: High to Low" },
    { value: "rating-asc", label: "Rating: Low to High" },
    { value: "price-asc", label: "Price: Ascending" },
    { value: "price-desc", label: "Price: Descending" },
  ];

  const handleSearchClick = () => {
    onSearch?.(searchInput.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearchClick();
  };

  return (
    <div className="flex flex-row justify-between items-center gap-2 w-full sm:w-auto">
      <div className="flex max-w-3xl w-full gap-2">
        <Input
          value={searchInput ?? ""}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="flex bg-white text-sm "
        ></Input>
        <Button
          variant="outline"
          size="icon"
          onClick={handleSearchClick}
          className="cursor-pointer flex items-center gap-2"
        >
          <Search size={18} />
          {/* <span className="hidden sm:inline">Search</span> */}
        </Button>
      </div>

      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer gap-2"
            >
              {/* {sortOptions.find((opt) => opt.value === currentSort)?.label ||
                "Sort"}
              <ChevronDown size={16} /> */}
              <ArrowDownUp size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSort(option.value)}
                className={
                  currentSort === option.value ? "bg-accent" : "cursor-pointer"
                }
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SearchBar;
