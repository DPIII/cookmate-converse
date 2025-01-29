import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Save, Image, X, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoadingSpinner } from "./LoadingSpinner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatActionsProps {
  onEdit: () => void;
  onSave: () => void;
  onNewRecipe: () => void;
  isLoading?: boolean;
  onGenerateImage: () => Promise<string | null>;
}

export const ChatActions = ({ 
  onEdit, 
  onSave, 
  onNewRecipe, 
  isLoading,
  onGenerateImage 
}: ChatActionsProps) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [shoppingListDialogOpen, setShoppingListDialogOpen] = useState(false);
  const [generatingList, setGeneratingList] = useState(false);
  const [shoppingList, setShoppingList] = useState<string | null>(null);
  const [hasGeneratedList, setHasGeneratedList] = useState(false);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    setImageDialogOpen(true);
    const imageUrl = await onGenerateImage();
    setGeneratedImage(imageUrl);
    setGeneratingImage(false);
  };

  const handleGenerateShoppingList = async () => {
    if (hasGeneratedList && shoppingList) {
      setShoppingListDialogOpen(true);
      return;
    }

    setGeneratingList(true);
    setShoppingListDialogOpen(true);
    
    try {
      // Find the recipe content in the message bubble
      const recipeBubble = document.querySelector('.prose');
      if (!recipeBubble) {
        throw new Error('Recipe content not found');
      }

      const { data, error } = await supabase.functions.invoke('generate-shopping-list', {
        body: { recipe: recipeBubble.textContent || '' },
      });

      if (error) throw error;

      setShoppingList(data.shoppingList);
      setHasGeneratedList(true);
      
      // Save the shopping list to the database
      const recipeElement = document.querySelector('[data-recipe-id]');
      if (recipeElement) {
        const recipeId = recipeElement.getAttribute('data-recipe-id');
        if (recipeId) {
          const { error: updateError } = await supabase
            .from('saved_recipes')
            .update({ shopping_list: data.shoppingList })
            .eq('id', recipeId);

          if (updateError) {
            console.error('Error saving shopping list:', updateError);
          }
        }
      }

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
  };

  return (
    <>
      <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
        <Button
          onClick={onEdit}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
          disabled={isLoading}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Recipe
        </Button>
        <Button
          onClick={handleGenerateImage}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
          disabled={isLoading || generatingImage}
        >
          <Image className="mr-2 h-4 w-4" />
          Generate Picture
        </Button>
        <Button
          onClick={handleGenerateShoppingList}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
          disabled={isLoading || generatingList}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {hasGeneratedList ? "Show Shopping List" : "Generate Shopping List"}
        </Button>
        <Button
          onClick={onSave}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
          disabled={isLoading}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Recipe
        </Button>
        <Button
          onClick={onNewRecipe}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          New Recipe
        </Button>
      </div>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <button
            onClick={() => setImageDialogOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <div className="py-4">
            {generatingImage ? (
              <div className="text-center">
                <LoadingSpinner />
                <p className="text-sm text-gray-500 mt-2">Generating image...</p>
              </div>
            ) : generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated recipe"
                className="w-full rounded-lg"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={shoppingListDialogOpen} onOpenChange={setShoppingListDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <button
            onClick={() => setShoppingListDialogOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <div className="flex-1 overflow-auto py-4">
            {generatingList ? (
              <div className="text-center">
                <LoadingSpinner />
                <p className="text-sm text-gray-500 mt-2">Generating shopping list...</p>
              </div>
            ) : shoppingList ? (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm font-sans">{shoppingList}</pre>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};