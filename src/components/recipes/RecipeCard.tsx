import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RatingStars } from "./RatingStars";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    meal_type?: string;
    cuisine_type?: string;
    rating?: number;
  };
  onClick: () => void;
}

export const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{recipe.title}</CardTitle>
        <CardDescription>
          Saved on {format(new Date(recipe.created_at), 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">{recipe.content}</p>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex gap-2">
            {recipe.meal_type && (
              <span className="inline-block text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {recipe.meal_type}
              </span>
            )}
            {recipe.cuisine_type && (
              <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {recipe.cuisine_type}
              </span>
            )}
          </div>
          {recipe.rating !== null && recipe.rating !== undefined && (
            <RatingStars
              rating={recipe.rating}
              tempRating={null}
              onRatingChange={() => {}}
              readonly
              size="sm"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};