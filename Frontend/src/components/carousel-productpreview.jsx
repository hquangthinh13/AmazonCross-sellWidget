import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const CarouselPreview = ({ images = [] }) => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(images.length || 0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  return (
    <div className="relative group w-full h-full flex justify-center items-center">
      <Carousel
        setApi={setApi}
        plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
        opts={{ loop: true }}
        className="w-full h-full flex justify-center items-center"
      >
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem
              key={index}
              className="w-full h-full flex justify-center items-center"
            >
              <div className="overflow-hidden aspect-square w-full flex-none flex justify-center items-center">
                <img
                  src={typeof img === "string" ? img : img.large}
                  alt={`Slide ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-full disabled:hidden" />
        <CarouselNext className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-full disabled:hidden" />

        {/* Counter (centered at bottom) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-2 py-1 rounded-md">
          {current}/{count || images.length || 0}
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselPreview;
