import { Star } from "lucide-react";

export const renderStars = (rating) => {
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
