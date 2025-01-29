import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ShoppingListDialog } from "../chat/actions/ShoppingListDialog";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    content: string;
    cuisine_type?: string;
    meal_type?: string;
    created_at: string;
    image_url?: string | null;
    rating?: number | null;
    shopping_list?: string | null;
  };
  onClick: () => void;
}

export const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const [showShoppingList, setShowShoppingList] = useState(false);

  const handleShoppingListClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShoppingList(true);
  };

  return (
    <>
      <Card
        className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative group"
        onClick={onClick}
      >
        {recipe.image_url && (
          <div className="aspect-video mb-4 overflow-hidden rounded-lg">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-2">
            {recipe.cuisine_type && (
              <span className="text-sm text-gray-500">{recipe.cuisine_type}</span>
            )}
            {recipe.meal_type && (
              <span className="text-sm text-gray-500">• {recipe.meal_type}</span>
            )}
          </div>
          {recipe.shopping_list && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleShoppingListClick}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              See Shopping List
            </Button>
          )}
        </div>
      </Card>

      <ShoppingListDialog
        open={showShoppingList}
        onOpenChange={setShowShoppingList}
        generatingList={false}
        shoppingList={recipe.shopping_list}
      />
    </>
  );
};