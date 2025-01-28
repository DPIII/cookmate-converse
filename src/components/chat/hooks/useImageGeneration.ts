import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useImageGeneration = () => {
  const { toast } = useToast();

  const generateImage = async (chatHistory: Array<{ role: string; content: string }>, selectedMeal: string | undefined) => {
    try {
      const lastAssistantMessage = [...chatHistory]
        .reverse()
        .find((msg) => msg.role === "assistant");

      if (!lastAssistantMessage) {
        toast({
          title: "No recipe found",
          description: "Generate a recipe first before creating an image.",
          variant: "destructive",
        });
        return null;
      }

      const words = lastAssistantMessage.content.split(' ').slice(0, 100).join(' ');
      const prompt = `${words}\n\nclean, lifelike overhead photo of the entree. camera, on a dinner table`;

      const { data, error } = await supabase.functions.invoke("generate-recipe-image", {
        body: { title: selectedMeal || "Recipe", prompt },
      });

      if (error) throw error;
      return data.imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate recipe image.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { generateImage };
};