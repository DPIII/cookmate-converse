import { format } from "date-fns";
import { Star } from "lucide-react";

interface RecipeMetadataProps {
  created_at: string;
  meal_type?: string;
  cuisine_type?: string;
  rating?: number;
}

export const RecipeMetadata = ({
  created_at,
  meal_type,
  cuisine_type,
  rating,
}: RecipeMetadataProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        Saved on {format(new Date(created_at), 'MMMM d, yyyy')}
      </div>
      <div className="flex gap-2">
        {meal_type && (
          <span className="inline-block text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {meal_type}
          </span>
        )}
        {cuisine_type && (
          <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {cuisine_type}
          </span>
        )}
        {rating && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600">
            <Star className="h-4 w-4 fill-current" />
            {rating}
          </span>
        )}
      </div>
    </div>
  );
};