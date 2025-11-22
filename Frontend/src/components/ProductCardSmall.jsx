import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RelatedProductDialog from "@/components/RelatedProductDialog";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Star,
  ShoppingCart,
  ChartNoAxesCombined,
  CircleQuestionMark,
} from "lucide-react";
import fallback from "../assets/images/fallback-image.png";
const REASON_LABELS = {
  co_purchase: "Frequently bought together with this item",
  category: "From the same or a closely related category",
  title: "Has a very similar product type or name",
};

const GRAPH_REASONS = new Set([
  "same_louvain",
  "same_spectral",
  "node2vec",
  "gcn",
]);

function abstractReasons(reasons = []) {
  const readable = [];

  if (reasons.includes("co_purchase")) {
    readable.push("Customers who bought this item also often buy this one.");
  }

  if (reasons.includes("category")) {
    readable.push("It belongs to the same or a closely related category.");
  }

  if (reasons.includes("title")) {
    readable.push("It’s a very similar type of product.");
  }

  const hasGraphSignal = reasons.some((r) => GRAPH_REASONS.has(r));
  if (hasGraphSignal) {
    readable.push(
      "It appears in similar browsing and buying patterns to this item."
    );
  }

  return readable;
}
const ProductCardSmall = ({ product }) => {
  const explanations = abstractReasons(product.reasons);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={10}
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
    <div className="flex flex-col h-full">
      <Card className="mx-auto w-full h-fit hover:shadow-lg transition overflow-hidden delay-150 duration-300 ease-in-out">
        {/* Cover image */}{" "}
        <Link to={`/${product.asin}`}>
          <div className="overflow-hidden aspect-square flex justify-center items-center">
            <img
              src={product?.meta_all.images?.[0]?.large || fallback}
              alt={product?.title || "No title"}
              className="cursor-pointer max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>
        </Link>
      </Card>
      {/* Content */}
      <div className="py-2 flex flex-1 ">
        <div className="flex flex-1  flex-col justify-between">
          <div>
            <HoverCard>
              <HoverCardTrigger asChild>
                {/* Title */}
                <Link to={`/${product.asin}`}>
                  <h2 className="line-clamp-2 cursor-pointer text-md font-semibold text-card-foreground antialiased hover:text-accent-foreground transition-colors duration-200 ease-in-out">
                    {product.title}
                  </h2>
                </Link>
              </HoverCardTrigger>

              <HoverCardContent className="px-2 py-1 h-fit opacity-85">
                <div className="text-sm text-primary-foreground">
                  {product.title}
                </div>
              </HoverCardContent>
            </HoverCard>
            {/* Rating */}
            <div className="flex justify-start items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {renderStars(product.meta_all.average_rating)}
                </div>
                <span className="text-xs text-muted-foreground gap-1 flex items-center">
                  <span className="font-medium">
                    {product.meta_all.average_rating.toFixed(1)}
                  </span>
                  <span>({product.meta_all.rating_number})</span>
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-start items-center gap-2 mt-0">
              {product?.categories?.slice(0, 2)?.map((cat) => (
                <Badge key={cat} variant="secondary">
                  {cat}
                </Badge>
              ))}

              {product?.categories?.length > 2 && (
                <Badge variant="outline">
                  +{product.categories.length - 2}
                </Badge>
              )}
            </div>
          </div>
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-md flex items-start">
              {(() => {
                const val = product?.meta_all?.price;

                if (val == null || val === "")
                  return (
                    <span className="flex text-md text-muted-foreground font-semibold">
                      Out of stock
                    </span>
                  );
                if (typeof val === "string") {
                  return <span>{val}</span>;
                }

                const num = Number(val);
                if (Number.isFinite(num)) {
                  return (
                    <div className="flex">
                      <span className="align-super ml-0.5">$</span>
                      <span className="text-xl font-semibold">
                        {Math.floor(num).toLocaleString()}
                      </span>
                    </div>
                  );
                }

                return (
                  <span className="text-md text-muted-foreground font-semibold">
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
            <RelatedProductDialog product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSmall;
