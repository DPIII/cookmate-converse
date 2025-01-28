import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const useRecipeSave = (
  user: User | null,
  chatHistory: Array<{ role: string; content: string }>,
  selectedMeal?: string,
  selectedCuisine?: string,
  customMeal?: string,
  customCuisine?: string,
) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveRecipe = async (title: string, notes: string, generatePhoto: boolean, onGenerateImage: () => Promise<string | null>) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to save recipes.",
        variant: "destructive",
      });
      return;
    }

    const lastAssistantMessage = [...chatHistory]
      .reverse()
      .find((msg) => msg.role === "assistant");

    if (!lastAssistantMessage) {
      toast({
        title: "No recipe to save",
        description: "Generate a recipe first before saving.",
        variant: "destructive",
      });
      return;
    }

    if (generatePhoto && !generatedImage) {
      const imageUrl = await onGenerateImage();
      setGeneratedImage(imageUrl);
    }

    try {
      const { error } = await supabase.from("saved_recipes").insert({
        title: title || `Recipe for ${
          selectedMeal === "Other" ? customMeal : selectedMeal || "Custom Dish"
        }`,
        content: lastAssistantMessage.content,
        meal_type: selectedMeal === "Other" ? customMeal : selectedMeal,
        cuisine_type: selectedCuisine === "Other" ? customCuisine : selectedCuisine,
        user_id: user.id,
        notes,
        image_url: generatedImage,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe saved successfully!",
      });

      return true;
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleSaveRecipe, generatedImage, setGeneratedImage };
};