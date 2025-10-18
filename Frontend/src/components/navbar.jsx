import React, { useEffect, useState, useMemo } from "react";
import logo from "../assets/images/Amazon_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={"/"}>
            <img src={logo} alt="Logo" className="h-8" />
          </Link>
          {/* Right section */}
          <div className="flex items-center gap-4">
            <Link to={"/cart"}>
              <Button variant="ghost" size="default" className="cursor-pointer">
                <ShoppingCart />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
