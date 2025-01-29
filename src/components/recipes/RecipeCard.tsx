import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ShoppingListDialog } from "../chat/actions/ShoppingListDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [showRecipePreview, setShowRecipePreview] = useState(false);
  const [generatingList, setGeneratingList] = useState(false);
  const { toast } = useToast();

  const handleShoppingListClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!recipe.shopping_list) {
      try {
        setGeneratingList(true);
        const { data, error } = await supabase.functions.invoke('generate-shopping-list', {
          body: { recipe: recipe.content },
        });

        if (error) throw error;

        const { error: updateError } = await supabase
          .from('saved_recipes')
          .update({ shopping_list: data.shoppingList })
          .eq('id', recipe.id);

        if (updateError) throw updateError;

        recipe.shopping_list = data.shoppingList;
        toast({
          title: "Success",
          description: "Shopping list generated successfully!",
        });
      } catch (error) {
        console.error('Error generating shopping list:', error);
        toast({
          title: "Error",
          description: "Failed to generate shopping list. Please try again.",
          variant: "destructive",
        });
      } finally {
        setGeneratingList(false);
      }
    }
    setShowShoppingList(true);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRecipePreview(true);
  };

  const previewContent = recipe.content.slice(0, 150) + "...";

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
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
              {recipe.title}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShoppingListClick}
              className="ml-2 shrink-0"
              disabled={generatingList}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {generatingList ? "Generating..." : "Shopping List"}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {recipe.cuisine_type && <span>{recipe.cuisine_type}</span>}
            {recipe.meal_type && <span>• {recipe.meal_type}</span>}
          </div>
          <p className="text-gray-600 text-sm line-clamp-3">{previewContent}</p>
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto text-green-600 hover:text-green-700"
            onClick={handlePreviewClick}
          >
            See more
          </Button>
        </div>
      </Card>

      <ShoppingListDialog
        open={showShoppingList}
        onOpenChange={setShowShoppingList}
        generatingList={generatingList}
        shoppingList={recipe.shopping_list}
      />

      <Dialog open={showRecipePreview} onOpenChange={setShowRecipePreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <div className="prose prose-green max-w-none overflow-y-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">{recipe.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: recipe.content }} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};