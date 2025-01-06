import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";
import { ChatActions } from "./ChatActions";
import { SaveRecipeDialog } from "./SaveRecipeDialog";
import { ChatInterfaceProps } from "./types";

export const ChatInterface = ({
  chatHistory,
  isLoading,
  onSend,
  selectedMeal,
  selectedCuisine,
  customMeal,
  customCuisine,
  selectedPeople,
  onReset,
}: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useAuth();

  const hasRecipe = chatHistory.some(msg => msg.role === "assistant");

  const generateImage = async (title: string, recipeContent: string) => {
    setIsGeneratingImage(true);
    try {
      const words = recipeContent.split(' ').slice(0, 100).join(' ');
      const prompt = `${words}\n\nclean, lifelike overhead photo of the entree. camera, on a dinner table`;

      const { data, error } = await supabase.functions.invoke("generate-recipe-image", {
        body: { title, prompt },
      });

      if (error) throw error;
      setGeneratedImage(data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate recipe image. Proceeding without image.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveRecipe = async (title: string, notes: string, generatePhoto: boolean) => {
    if (!session?.user?.id) {
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
      await generateImage(title, lastAssistantMessage.content);
    }

    try {
      // Add a delay to allow schema cache to update
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { error } = await supabase.from("saved_recipes").insert({
        title: title || `Recipe for ${
          selectedMeal === "Other" ? customMeal : selectedMeal || "Custom Dish"
        }`,
        content: lastAssistantMessage.content,
        meal_type: selectedMeal === "Other" ? customMeal : selectedMeal,
        cuisine_type: selectedCuisine === "Other" ? customCuisine : selectedCuisine,
        user_id: session.user.id,
        notes,
        image_url: generatedImage,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe saved successfully!",
      });

      setIsSaveDialogOpen(false);
      setGeneratedImage(null);
      navigate("/recipes");
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSend(message, isEditing);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    toast({
      title: "Edit Mode",
      description: "Type your modifications to the recipe",
    });
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-primary/10">
      <ChatHistory messages={chatHistory} isLoading={isLoading} />
      
      <ChatInput
        message={message}
        isLoading={isLoading}
        isEditing={isEditing}
        onMessageChange={setMessage}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
      />

      {hasRecipe && (
        <ChatActions
          onEdit={startEditing}
          onSave={() => setIsSaveDialogOpen(true)}
          onNewRecipe={() => {
            if (onReset) {
              onReset();
              setIsEditing(false);
            }
          }}
        />
      )}

      <SaveRecipeDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSaveRecipe}
        isGeneratingImage={isGeneratingImage}
        generatedImage={generatedImage}
      />
    </div>
  );
};