import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import api from "../lib/api";
import fallback from "../assets/images/fallback-image.png";
import CarouselPreview from "../components/carousel-productpreview";
import { Star, ArrowLeft, ShoppingCart, ShoppingBasket } from "lucide-react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProductDetailPage = () => {
  const renderStars = (rating) => {
    if (!rating) return null; // prevent errors
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
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

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/products/${id}`); // ✅ corrected endpoint
      console.log("Product detail:", data);
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // ✅ Render guards to prevent crashing
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl mt-2 p-4">
        <Link to={"/"}>
          <Button variant="ghost" className="cursor-pointer">
            <ArrowLeft />
            <div className="hidden md:flex lg:flex">Back</div>
          </Button>
        </Link>

        <Card className="mt-2 overflow-hidden">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-start items-start">
              {/* Images */}
              <div className="p-2 aspect-square w-36 sm:48 md:w-52 lg:w-80 flex-none flex justify-center items-center border-1 rounded-xs border-b-border">
                <CarouselPreview
                  images={product.images.map((img) => img.large)}
                />
              </div>

              <div className="flex-col w-full space-y-1 justify-start">
                {/* Title */}
                <h2 className="flex text-2xl font-semibold antialiased">
                  {product.title}
                </h2>
                {/* rating stars */}
                <div className="flex justify-start items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(product.average_rating)}
                    <span className=" text-muted-foreground">
                      <span className="font-medium text-primary">
                        {product.average_rating?.toFixed(1)}
                      </span>
                      <span> ({product.rating_number} reviews)</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-xl align-super ml-0.5 font-semibold">
                    $
                  </span>
                  {/* <span className="text-5xl leading-none text-secondary">
                    $
                  </span> */}
                  <span className="text-5xl leading-none font-semibold">
                    {Math.floor(product.price)}
                  </span>
                  {(() => {
                    const cents = (product.price % 1).toFixed(2).split(".")[1];
                    return cents !== "00" ? (
                      <span className="text-xl align-super ml-0.5 font-semibold">
                        {cents}
                      </span>
                    ) : null;
                  })()}
                </div>
                {/* Buy buttons */}
                <div className="flex flex-row gap-2 mt-4">
                  <Button
                    className="cursor-pointer"
                    size="default"
                    variant="secondary"
                  >
                    <ShoppingBasket />
                    Buy now{" "}
                  </Button>

                  <Button
                    className="cursor-pointer"
                    size="default"
                    variant="outline"
                  >
                    <ShoppingCart />
                    Add to Cart
                  </Button>
                </div>

                {product?.features?.length > 0 && (
                  <>
                    <Separator className="mt-4 mb-4" />
                    {/* Features */}
                    <div className="mt-2">
                      <span className="text-lg font-semibold antialiased">
                        About this item
                      </span>
                      <ul className="list-disc pl-8">
                        {product.features.map((text, index) => (
                          <li key={index}>{text}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>{" "}
          </CardContent>
        </Card>

        <Card></Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
