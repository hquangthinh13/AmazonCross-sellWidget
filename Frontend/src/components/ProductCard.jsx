import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart } from "lucide-react";
import fallback from "../assets/images/fallback-image.png";

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
      {/* Cover image */}{" "}
      <Link to={`/${product._id}`}>
        <div className="overflow-hidden aspect-square flex justify-center items-center">
          <img
            src={product?.images?.[0]?.large || fallback}
            alt={product?.title || "No title"}
            className="cursor-pointer max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
      </Link>
      {/* Content */}
      <CardContent className="p-4 h-fit">
        {/* Title */}
        <Link to={`/${product._id}`}>
          <h2 className="line-clamp-4 cursor-pointer text-lg font-semibold text-[var(--card-foreground)] mb-0 antialiased hover:text-accent-foreground transition-colors duration-200 ease-in-out">
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
              </span>
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
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
