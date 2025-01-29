import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageDialog } from "./actions/ImageDialog";
import { ShoppingListDialog } from "./actions/ShoppingListDialog";
import { ActionButtons } from "./actions/ActionButtons";

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
  isLoading = false,
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
      <ActionButtons
        onEdit={onEdit}
        onSave={onSave}
        onNewRecipe={onNewRecipe}
        onGenerateImage={handleGenerateImage}
        onGenerateShoppingList={handleGenerateShoppingList}
        isLoading={isLoading}
        generatingImage={generatingImage}
        generatingList={generatingList}
        hasGeneratedList={hasGeneratedList}
      />

      <ImageDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        generatingImage={generatingImage}
        generatedImage={generatedImage}
      />

      <ShoppingListDialog
        open={shoppingListDialogOpen}
        onOpenChange={setShoppingListDialogOpen}
        generatingList={generatingList}
        shoppingList={shoppingList}
      />
    </>
  );
};