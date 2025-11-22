import React, { useEffect, useState, useMemo } from "react";
import logo from "../assets/images/Amazon_logo_dark.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import SearchBar from "../components/searchbar";
import { Menu } from "lucide-react";

const Navbar = ({}) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={"/"}>
              <img src={logo} alt="Logo" className="h-10" />
            </Link>
            <SearchBar
              onSearch={(q) => {
                if (!q) return;
                navigate(`/?q=${encodeURIComponent(q)}&page=1`);
              }}
            />
            {/* Right section */}
            <div className="flex items-center gap-4">
              <Link to={"/cart"}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="cursor-pointer"
                >
                  <ShoppingCart />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="bg-foreground h-fit ">
        <div className="hidden lg:flex items-center justify-between mx-auto max-w-6xl px-4 py-2">
          <div className="flex items-center gap-4 text-white font-light text-sm">
            <Menu className="h-4 w-4 cursor-pointer" />
            <p className="cursor-pointer hover:underline hover:decoration-1 hover:decoration-primary hover:underline-offset-4">
              PC
            </p>
            <p className="cursor-pointer hover:underline  hover:decoration-1 hover:decoration-primary hover:underline-offset-4">
              Video Games
            </p>
            <p className="cursor-pointer hover:underline  hover:decoration-1 hover:decoration-primary hover:underline-offset-4">
              Xbox One
            </p>
            <p className="cursor-pointer hover:underline  hover:decoration-1 hover:decoration-primary hover:underline-offset-4">
              PlayStation 4
            </p>
            <p className="cursor-pointer hover:underline  hover:decoration-1 hover:decoration-primary hover:underline-offset-4">
              Accessories
            </p>
            <p className="cursor-pointer hover:underline  hover:decoration-1 hover:decoration-primary hover:underline-offset-4">
              Today's Deal
            </p>
          </div>

          <div className="flex items-center gap-4 text-white font-medium text-sm">
            <p className="cursor-pointer">
              Big Sale on Project Report Day | SHOP NOW
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
