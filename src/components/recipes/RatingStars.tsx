import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RatingStarsProps {
  rating: number | null;
  tempRating: number | null;
  onRatingChange: (rating: number) => void;
  onSaveRating?: () => void;
  readonly?: boolean;
  size?: "sm" | "md";
}

export const RatingStars = ({ 
  rating, 
  tempRating, 
  onRatingChange, 
  onSaveRating,
  readonly = false,
  size = "md"
}: RatingStarsProps) => {
  const currentRating = tempRating ?? rating;
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonSize = size === "sm" ? "p-0.5" : "p-1";
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            disabled={readonly}
            onClick={() => onRatingChange(star)}
            className={`${buttonSize} ${
              currentRating >= star ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            <Star 
              className={starSize} 
              fill={currentRating >= star ? 'currentColor' : 'none'} 
            />
          </Button>
        ))}
      </div>
      {!readonly && tempRating !== null && onSaveRating && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveRating}
          className="ml-2 text-xs"
        >
          Save Rating
        </Button>
      )}
    </div>
  );
};