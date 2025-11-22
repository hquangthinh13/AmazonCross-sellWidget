import React from "react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import logo from "../assets/images/Amazon_logo_dark.png";

const Footer = () => {
  return (
    <footer className="mt-12 bottom-0 overflow-hidden bg-foreground">
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-full bg-[#37475A] py-3 text-center text-white text-sm cursor-pointer hover:bg-[#485769]"
      >
        Back to top
      </div>

      <div className=" mx-auto flex flex-col items-center justify-center px-6 pt-6 pb-12 max-w-4xl">
        <div className="gap-6 flex flex-row flex-wrap w-full justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-md font-semibold text-white">Get to Know Us</p>
            <div className="flex flex-col gap-1 text-sm font-light text-white opacity-90">
              <p>Careers</p>
              <p>About Amazon</p>
              <p>Amazon Devices</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-md font-semibold text-white">
              Make Money with Us
            </p>
            <div className="flex flex-col gap-1 text-sm font-light text-white opacity-90">
              <p>Sell Products on Amazon</p>
              <p>Sell on Amazon Business</p>
              <p>Sell apps on Amazon</p>
              <p>Become an Affiliate</p>
              <p>Advertise Your Products</p>
              <p>Self-Publish with Us</p>
              <p>Host an Amazon Hub</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-md font-semibold text-white">
              Amazon Payment Products
            </p>
            <div className="flex flex-col gap-1 text-sm font-light text-white opacity-90">
              <p>Amazon Business Card</p>
              <p>Shop with Points</p>
              <p>Reload Your Balance</p>
              <p>Amazon Currency Converter</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-md font-semibold text-white">Let Us Help You</p>
            <div className="flex flex-col gap-1 text-sm font-light text-white opacity-90">
              <p>Your Account</p>
              <p>Your Orders</p>
              <p>Shipping Rates & Policies</p>
            </div>
          </div>
        </div>
        <Separator className="my-12 opacity-40" />
        <div className="mt-0 flex flex-row w-full justify-center gap-8">
          <Link to={"/"}>
            <img src={logo} alt="Logo" className="h-7" />
          </Link>
          <span className="text-white text-xs font-light tracking-wide">
            © 2025 Nhung Nguoi Ban Y Nghia.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
