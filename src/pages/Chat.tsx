import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/Navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { RecipeFilters } from "@/components/chat/RecipeFilters";

const Chat = () => {
  const [selectedMeal, setSelectedMeal] = useState<string>();
  const [selectedCuisine, setSelectedCuisine] = useState<string>();
  const [customMeal, setCustomMeal] = useState("");
  const [customCuisine, setCustomCuisine] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const { toast } = useToast();

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const mealType = selectedMeal === "Other" ? customMeal : selectedMeal;
    const cuisineType = selectedCuisine === "Other" ? customCuisine : selectedCuisine;

    const userMessage = `${
      mealType ? `I want a ${mealType.toLowerCase()} recipe` : "I want a recipe"
    }${cuisineType ? ` from ${cuisineType} cuisine` : ""}. ${message}`;

    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-recipe", {
        body: {
          prompt: message,
          mealType,
          cuisineType,
        },
      });

      if (error) throw error;

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.recipe },
      ]);
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50/30">
      <Navigation />
      <div className="container mx-auto max-w-3xl px-4 py-6 pt-20">
        <Card className="p-4">
          <RecipeFilters
            selectedMeal={selectedMeal}
            setSelectedMeal={setSelectedMeal}
            selectedCuisine={selectedCuisine}
            setSelectedCuisine={setSelectedCuisine}
            customMeal={customMeal}
            setCustomMeal={setCustomMeal}
            customCuisine={customCuisine}
            setCustomCuisine={setCustomCuisine}
          />
          <ChatInterface
            chatHistory={chatHistory}
            isLoading={isLoading}
            onSend={handleSend}
            selectedMeal={selectedMeal}
            selectedCuisine={selectedCuisine}
            customMeal={customMeal}
            customCuisine={customCuisine}
          />
        </Card>
      </div>
    </div>
  );
};

export default Chat;