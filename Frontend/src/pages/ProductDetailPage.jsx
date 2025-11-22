import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import fallback from "@/assets/images/fallback-image.png";
import ProductCardSmall from "@/components/ProductCardSmall";
import CarouselPreview from "@/components/carousel-productpreview";
import { Star, ArrowLeft, ShoppingCart, ShoppingBasket } from "lucide-react";
import { useParams } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/spinner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logo from "@/assets/images/Amazon_logo.svg";
import { renderStars } from "@/utils/utils.jsx";
const getSafePrice = (val) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
};

const ProductDetailPage = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductsBySignals, setRelatedProductsBySignals] = useState({
    spectral: [],
    louvain: [],
    category: [],
    gcn: [],
    node2vec: [],
    title: [],
  });

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const raw = getSafePrice(product?.meta_all?.price);
  const hasPrice = raw !== null;
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/products/${id}`);
      console.log("Product detail:", data);
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };
  const fetchRelated = async () => {
    try {
      const { data } = await api.get(`/products/${id}/related`);
      if (data?.related?.length) {
        setRelatedProducts(data.related);
      } else {
        setRelatedProducts([]);
      }
      console.log("Related products", data);
    } catch (err) {
      console.error("Error fetching related products:", err);
      setRelatedProducts([]);
    }
  };
  const fetchRelatedProductsBySignals = async () => {
    try {
      const { data } = await api.get(`/products/${id}/related/signals`);

      // data is already in the correct grouped shape
      setRelatedProductsBySignals({
        spectral: data.spectral ?? [],
        louvain: data.louvain ?? [],
        category: data.category ?? [],
        gcn: data.gcn ?? [],
        node2vec: data.node2vec ?? [],
        title: data.title ?? [],
      });

      console.log("Related products by signals", data);
    } catch (err) {
      console.error("Error fetching related products by signals:", err);
      setRelatedProductsBySignals({
        spectral: [],
        louvain: [],
        category: [],
        gcn: [],
        node2vec: [],
        title: [],
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelated();
      fetchRelatedProductsBySignals();
    }
  }, [id]);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Empty className="h-full">
          <EmptyHeader>
            <EmptyMedia>
              <Link to={"/"} className="flex flex-1">
                <img src={logo} alt="Amazon Logo" className="h-12" />
              </Link>
            </EmptyMedia>
            <EmptyTitle>Product not found</EmptyTitle>
            <EmptyDescription>
              The requested product doesn’t exist.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button className="cursor-pointer" onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </div>
          </EmptyContent>
        </Empty>{" "}
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl mt-2 p-4">
        <Link to={"/"}>
          <Button variant="ghost" className="cursor-pointer">
            <ArrowLeft />
            <div className="hidden md:flex lg:flex">Back</div>
          </Button>
        </Link>

        <Card className="mt-2 overflow-hidden">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-12 justify-start items-start">
              {/* Images */}
              <div className="p-2 aspect-square w-36 sm:48 md:w-52 lg:w-80 flex-none flex justify-center items-center border-1 rounded-xs border-b-border">
                <CarouselPreview
                  images={(product.meta_all?.images || fallback)
                    .map((img) => img.large)
                    .filter(Boolean)}
                />
              </div>

              <div className="flex-col w-full space-y-1 justify-start">
                {/* Title */}
                <h2 className="flex text-2xl font-semibold antialiased">
                  {product.title}
                </h2>
                {/* rating stars */}
                <div className="flex justify-start items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    {renderStars(product.meta_all.average_rating)}
                    <span className=" text-muted-foreground">
                      <span className="font-medium text-primary">
                        {product.meta_all.average_rating?.toFixed(1)}
                      </span>
                      <span> ({product.meta_all.rating_number} reviews)</span>
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
                      const cents = (product.price % 1)
                        .toFixed(2)
                        .split(".")[1];
                      return cents !== "00" ? (
                        <span className="align-super ml-0.5 font-semibold">
                          {cents}
                        </span>
                      ) : null;
                    })()}
                  </span>
                </div>
                {/* Buy buttons */}
                <div className="flex flex-row gap-2 mt-4">
                  <Button
                    className="cursor-pointer"
                    size="default"
                    variant="outline"
                  >
                    <ShoppingCart />
                    Add to Cart
                  </Button>{" "}
                  <Button
                    className="cursor-pointer"
                    size="default"
                    variant="secondary"
                  >
                    <ShoppingBasket />
                    Buy now{" "}
                  </Button>
                </div>

                {product?.meta_all.features?.length > 0 && (
                  <>
                    <Separator className="mt-4 mb-4" />
                    {/* Features */}
                    <div className="mt-2">
                      <span className="text-lg font-semibold antialiased">
                        About this item
                      </span>
                      <ul className="list-disc text-sm text-muted-foreground pl-8">
                        {product.meta_all.features.map((text, index) => (
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

        {/* Related Products Final */}
        <div className="w-full max-w-6xl mx-auto mt-4">
          <Carousel
            className="relative w-full"
            plugins={[
              Autoplay({
                delay: 150000, // 5 seconds between slides
                stopOnInteraction: false,
                stopOnMouseEnter: true,
                stopOnFocusIn: true,
              }),
            ]}
            opts={{
              loop: false, // makes the carousel loop infinitely
            }}
          >
            {/* Header row */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col flex-1 items-start gap-1">
                <p className="text-xl font-bold text-card-foreground relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[3px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                  Final Recommendation{" "}
                </p>
                <p className="relative inline-block text-md text-muted-foreground">
                  Final{" "}
                </p>
              </div>

              <div className="flex justify-end items-center mb-3 gap-2">
                <CarouselPrevious className="cursor-pointer relative left-auto right-auto top-auto translate-y-0 h-8 w-8" />
                <CarouselNext className="cursor-pointer relative left-auto right-auto top-auto translate-y-0 h-8 w-8" />
              </div>
            </div>

            <CarouselContent>
              {loading ? (
                <div className="w-full h-32 flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                relatedProducts.map((prod) => (
                  <CarouselItem
                    className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                    key={prod.asin}
                  >
                    <ProductCardSmall product={prod} />
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
          </Carousel>
        </div>
        {/* <div className="flex flex-1 justify-between"> */}
        <Tabs defaultValue="spectral" className="flex flex-col flex-1 mt-12">
          <TabsList className="flex flex-1 gap-2 w-full mx-auto">
            <TabsTrigger
              className="cursor-pointer flex flex-1"
              value="spectral"
            >
              Spectral
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer flex flex-1" value="louvain">
              Louvain
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer flex flex-1"
              value="category"
            >
              Category
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer flex flex-1" value="gcn">
              GCN
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer flex flex-1"
              value="node2vec"
            >
              Node2Vec
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spectral">
            <div className="flex flex-row gap-4 max-w-4xl mx-auto justify-center">
              {!loading && relatedProductsBySignals.spectral.length > 0 && (
                <div
                  key={location.search}
                  className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                >
                  {relatedProductsBySignals.spectral.map((prod) => (
                    <ProductCardSmall key={prod.asin} product={prod} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="louvain">
            <div className="flex flex-row gap-4 max-w-4xl mx-auto justify-center">
              {!loading && relatedProductsBySignals.louvain.length > 0 && (
                <div
                  key={location.search}
                  className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                >
                  {relatedProductsBySignals.louvain.map((prod) => (
                    <ProductCardSmall key={prod.asin} product={prod} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="category">
            <div className="flex flex-row gap-4 max-w-4xl mx-auto justify-center">
              {!loading && relatedProductsBySignals.category.length > 0 && (
                <div
                  key={location.search}
                  className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                >
                  {relatedProductsBySignals.category.map((prod) => (
                    <ProductCardSmall key={prod.asin} product={prod} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="gcn">
            <div className="flex flex-row gap-4 max-w-4xl mx-auto justify-center">
              {!loading && relatedProductsBySignals.gcn.length > 0 && (
                <div
                  key={location.search}
                  className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                >
                  {relatedProductsBySignals.gcn.map((prod) => (
                    <ProductCardSmall key={prod.asin} product={prod} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="node2vec">
            <div className="flex flex-row gap-4 max-w-4xl mx-auto justify-center">
              {!loading && relatedProductsBySignals.node2vec.length > 0 && (
                <div
                  key={location.search}
                  className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                >
                  {relatedProductsBySignals.node2vec.map((prod) => (
                    <ProductCardSmall key={prod.asin} product={prod} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="title">
            <div className="flex flex-row gap-4 max-w-4xl mx-auto justify-center">
              {!loading && relatedProductsBySignals.title.length > 0 && (
                <div
                  key={location.search}
                  className="grid mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                >
                  {relatedProductsBySignals.title.map((prod) => (
                    <ProductCardSmall key={prod.asin} product={prod} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    // </div>
  );
};

export default ProductDetailPage;
