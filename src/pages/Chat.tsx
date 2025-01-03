import { useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/Navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { RecipeFilters } from "@/components/chat/RecipeFilters";
import { useAuth } from "@/components/AuthProvider";

const Chat = () => {
  const [selectedMeal, setSelectedMeal] = useState<string>();
  const [selectedCuisine, setSelectedCuisine] = useState<string>();
  const [selectedDiet, setSelectedDiet] = useState<string>();
  const [customMeal, setCustomMeal] = useState("");
  const [customCuisine, setCustomCuisine] = useState("");
  const [customDiet, setCustomDiet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleSend = async (message: string, isEdit: boolean = false) => {
    if (!message.trim()) return;

    const mealType = selectedMeal === "Other" ? customMeal : selectedMeal;
    const cuisineType = selectedCuisine === "Other" ? customCuisine : selectedCuisine;
    const dietaryRestriction = selectedDiet === "Other" ? customDiet : selectedDiet;

    let userMessage = message;
    if (!isEdit) {
      userMessage = `${
        mealType ? `I want a ${mealType.toLowerCase()} recipe` : "I want a recipe"
      }${cuisineType ? ` from ${cuisineType} cuisine` : ""}${
        dietaryRestriction && dietaryRestriction !== "None"
          ? ` that is ${dietaryRestriction.toLowerCase()}`
          : ""
      }. ${message}`;
    }

    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-recipe", {
        body: {
          prompt: message,
          mealType: isEdit ? undefined : mealType,
          cuisineType: isEdit ? undefined : cuisineType,
          dietaryRestriction: isEdit ? undefined : dietaryRestriction,
          isEdit,
          previousRecipe: isEdit ? chatHistory[chatHistory.length - 2]?.content : undefined,
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

  const handleReset = () => {
    setChatHistory([]);
    setSelectedMeal(undefined);
    setSelectedCuisine(undefined);
    setSelectedDiet(undefined);
    setCustomMeal("");
    setCustomCuisine("");
    setCustomDiet("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto max-w-4xl px-4 py-6 pt-20">
        <Card className="p-6 bg-card/50 shadow-lg border-primary/20">
          <RecipeFilters
            selectedMeal={selectedMeal}
            setSelectedMeal={setSelectedMeal}
            selectedCuisine={selectedCuisine}
            setSelectedCuisine={setSelectedCuisine}
            selectedDiet={selectedDiet}
            setSelectedDiet={setSelectedDiet}
            customMeal={customMeal}
            setCustomMeal={setCustomMeal}
            customCuisine={customCuisine}
            setCustomCuisine={setCustomCuisine}
            customDiet={customDiet}
            setCustomDiet={setCustomDiet}
          />
          <ChatInterface
            chatHistory={chatHistory}
            isLoading={isLoading}
            onSend={handleSend}
            selectedMeal={selectedMeal}
            selectedCuisine={selectedCuisine}
            customMeal={customMeal}
            customCuisine={customCuisine}
            onReset={handleReset}
          />
        </Card>
      </div>
    </div>
  );
};

export default Chat;