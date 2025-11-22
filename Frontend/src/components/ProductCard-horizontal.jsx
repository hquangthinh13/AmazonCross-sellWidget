import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Star, ShoppingCart, ShoppingBasket } from "lucide-react";
import fallback from "../assets/images/fallback-image.png";
const getSafePrice = (val) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
};

const ProductCard = ({ product }) => {
  const raw = getSafePrice(product?.meta_all?.price);
  const hasPrice = raw !== null;
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
      {/* Content */}
      <CardContent className="p-4 h-fit">
        <div className="flex flex-row gap-6 justify-start">
          {/* Cover image */}{" "}
          <Link to={`/${product._id}`}>
            <div className="overflow-hidden aspect-square h-40 flex justify-center items-center">
              <img
                src={product?.meta_all.images?.[0]?.large || fallback}
                alt={product?.title || "No title"}
                className="cursor-pointer max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
          </Link>
          {/* Title + Rating */}
          <div className="flex flex-1 flex-col justify-start gap-4">
            <div className="flex flex-col gap-0">
              <Link to={`/${product._id}`}>
                <h2 className="line-clamp-1 cursor-pointer text-lg font-semibold text-[var(--card-foreground)] mb-0 antialiased hover:text-accent-foreground transition-colors duration-200 ease-in-out">
                  {product.title}
                </h2>{" "}
              </Link>
              {/* Rating */}
              <div className="flex justify-start items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {renderStars(product.meta_all.average_rating)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    <span className="font-medium">
                      {product.meta_all.average_rating.toFixed(1)}
                    </span>
                    ({product.meta_all.rating_number})
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-start items-center gap-2 mt-2">
                {product?.categories?.map((cat) => (
                  <Badge key={cat} variant="outline">
                    {cat}
                  </Badge>
                ))}
              </div>

              {/* Price */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-md flex items-start">
                  {(() => {
                    const val = product?.meta_all?.price;

                    if (val == null || val === "")
                      return (
                        <span className="text-xl text-muted-foreground leading-none font-semibold">
                          Out of stock
                        </span>
                      );
                    if (typeof val === "string") {
                      // if it's a text like "from 64.98", display as-is
                      return <span>{val}</span>;
                    }

                    const num = Number(val);
                    if (Number.isFinite(num)) {
                      return (
                        <>
                          <span className="align-super ml-0.5">$</span>
                          <span className="text-3xl leading-none font-semibold">
                            {Math.floor(num).toLocaleString()}
                          </span>
                        </>
                      );
                    }

                    return (
                      <span className="text-xl text-muted-foreground leading-none font-semibold">
                        Out of stock
                      </span>
                    );
                  })()}

                  {(() => {
                    const cents = (product.price % 1).toFixed(2).split(".")[1];
                    return cents !== "00" ? (
                      <span className="align-super ml-0.5 font-semibold">
                        {cents}
                      </span>
                    ) : null;
                  })()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="flex sm:hidden cursor-pointer"
              >
                <ShoppingBasket />
              </Button>
              <Button
                variant="outline"
                className="hidden sm:flex cursor-pointer"
              >
                <ShoppingCart />
                Add to Cart
              </Button>{" "}
              <Button
                variant="secondary"
                className="hidden sm:flex cursor-pointer"
              >
                <ShoppingBasket />
                Buy now
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="flex sm:hidden cursor-pointer"
              >
                <ShoppingCart />
              </Button>
            </div>
            {/* Price and Add to Cart */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
