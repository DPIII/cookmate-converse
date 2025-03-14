import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ChatHistory } from "./ChatHistory";
import { ChatInput } from "./ChatInput";
import { ChatActions } from "./ChatActions";
import { SaveRecipeDialog } from "./SaveRecipeDialog";
import { ChatContainer } from "./ChatContainer";
import { ChatInterfaceProps } from "./types";
import { useImageGeneration } from "./hooks/useImageGeneration";
import { useRecipeSave } from "./hooks/useRecipeSave";
import { useConnectionMonitor } from "./hooks/useConnectionMonitor";
import { useToast } from "@/hooks/use-toast";

export const ChatInterface = ({
  chatHistory,
  isLoading,
  onSend,
  selectedMeal,
  selectedCuisine,
  selectedDiet,
  customMeal,
  customCuisine,
  customDiet,
  selectedPeople,
  onReset,
}: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useConnectionMonitor();
  const { generateImage } = useImageGeneration();
  const { handleSaveRecipe, generatedImage, setGeneratedImage } = useRecipeSave(
    session?.user || null,
    chatHistory,
    selectedMeal,
    selectedCuisine,
    customMeal,
    customCuisine
  );

  const hasRecipe = chatHistory.some(msg => msg.role === "assistant");

  const handleGenerateImage = async () => {
    return generateImage(chatHistory, selectedMeal);
  };

  const handleSaveRecipeWrapper = async (title: string, notes: string, generatePhoto: boolean) => {
    try {
      const success = await handleSaveRecipe(title, notes, generatePhoto, handleGenerateImage);
      if (success) {
        setIsSaveDialogOpen(false);
        setGeneratedImage(null);
        toast({
          title: "Success",
          description: "Recipe saved successfully!",
        });
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const constructFullMessage = (baseMessage: string) => {
    let fullMessage = baseMessage;
    
    // Add meal type to the message if present
    if (selectedMeal && selectedMeal !== "None") {
      const mealType = selectedMeal === "Other" ? customMeal : selectedMeal;
      if (!fullMessage.toLowerCase().includes(mealType.toLowerCase())) {
        fullMessage = `${fullMessage} as a ${mealType} dish`;
      }
    }

    // Add cuisine type to the message if present
    if (selectedCuisine && selectedCuisine !== "None") {
      const cuisine = selectedCuisine === "Other" ? customCuisine : selectedCuisine;
      if (!fullMessage.toLowerCase().includes(cuisine.toLowerCase())) {
        fullMessage = `${fullMessage} in ${cuisine} style`;
      }
    }

    // Add dietary restrictions to the message if present
    if (selectedDiet && selectedDiet !== "None") {
      const dietRestriction = selectedDiet === "Other" ? customDiet : selectedDiet;
      if (!fullMessage.toLowerCase().includes(dietRestriction.toLowerCase())) {
        fullMessage = `${fullMessage} (Must follow ${dietRestriction} dietary restrictions)`;
      }
    }

    return fullMessage;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault(); // Prevent form submission
    if (message.trim() && !isLoading) {
      const fullMessage = constructFullMessage(message);
      onSend(fullMessage, isEditing);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    toast({
      title: "Edit Mode Enabled",
      description: "Type your modifications to the recipe and I'll update it accordingly.",
    });
  };

  const handleNewRecipe = () => {
    setIsEditing(false);
    if (message.trim()) {
      const fullMessage = constructFullMessage(message);
      onSend(fullMessage, false);
      setMessage("");
    } else if (onReset) {
      onReset();
    }
  };

  const lastAssistantMessage = [...chatHistory]
    .reverse()
    .find((msg) => msg.role === "assistant");

  return (
    <ChatContainer>
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
          onNewRecipe={handleNewRecipe}
          onGenerateImage={handleGenerateImage}
          isLoading={isLoading}
        />
      )}

      <SaveRecipeDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSaveRecipeWrapper}
        isGeneratingImage={false}
        generatedImage={generatedImage}
        recipe={lastAssistantMessage || { role: "assistant", content: "" }}
      />
    </ChatContainer>
  );
};