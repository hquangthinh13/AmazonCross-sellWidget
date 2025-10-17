import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={`${
              star <= Math.floor(rating)
                ? "fill-primary text-primary"
                : star - rating < 1
                ? "fill-primary text-primary opacity-40"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };
  return (
    <Card className="mx-auto w-full h-fit hover:shadow-lg transition overflow-hidden delay-150 duration-300 ease-in-out">
      {/* Cover image */}
      <div className="overflow-hidden">
        <Link to={`/products/${product._id}`}>
          <img
            src={product?.images?.[0]?.large || "fallback.jpg"}
            alt={product?.title || "No title"}
            className="cursor-pointer h-auto w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />{" "}
        </Link>
      </div>

      {/* Content */}
      <CardContent className="p-4 h-fit">
        {/* Title */}
        <Link to={`/products/${product._id}`}>
          <h2 className="cursor-pointer text-xl font-semibold text-[var(--card-foreground)] mb-0 antialiased hover:text-accent-foreground transition-colors duration-200 ease-in-out">
            {product.title}
          </h2>{" "}
        </Link>

        {/* Rating */}
        <div className="flex justify-start items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {renderStars(product.average_rating)}
            </div>
            <span className="text-xs text-muted-foreground">
              <span className="font-medium">
                {product.average_rating.toFixed(1)}
              </span>{" "}
              ({product.rating_number})
            </span>
          </div>
        </div>
        <Separator className="flex mt-2 mb-2" />

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-lg flex items-start">
            <span className="text-sm align-super ml-0.5"> $ </span>

            <span className="text-2xl leading-none font-semibold">
              {Math.floor(product.price)}
            </span>
            {(() => {
              const cents = (product.price % 1).toFixed(2).split(".")[1];
              return cents !== "00" ? (
                <span className="text-sm align-super ml-0.5 font-semibold">
                  {cents}
                </span>
              ) : null;
            })()}
          </span>
          <Button variant="ghost" className="cursor-pointer">
            <ShoppingCart />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
