import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/components/AuthProvider";
import { FilterSection } from "@/components/chat/sections/FilterSection";
import { ImageUploadSection } from "@/components/chat/sections/ImageUploadSection";
import { ChatSection } from "@/components/chat/sections/ChatSection";

const Chat = () => {
  const [selectedMeal, setSelectedMeal] = useState<string>();
  const [selectedCuisine, setSelectedCuisine] = useState<string>();
  const [selectedDiet, setSelectedDiet] = useState<string>();
  const [selectedPeople, setSelectedPeople] = useState<string>("2");
  const [customMeal, setCustomMeal] = useState("");
  const [customCuisine, setCustomCuisine] = useState("");
  const [customDiet, setCustomDiet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const { toast } = useToast();
  const { session } = useAuth();

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSend = async (message: string, isEdit: boolean = false) => {
    if (!message.trim()) return;

    const mealType = selectedMeal === "Other" ? customMeal : selectedMeal;
    const cuisineType = selectedCuisine === "Other" ? customCuisine : selectedCuisine;
    const dietaryRestriction = selectedDiet === "Other" ? customDiet : selectedDiet;
    const servings = selectedPeople === "More" ? "6+" : selectedPeople;

    let userMessage = message;
    if (!isEdit) {
      userMessage = `${
        mealType ? `I want a ${mealType.toLowerCase()} recipe` : "I want a recipe"
      }${cuisineType ? ` from ${cuisineType} cuisine` : ""}${
        dietaryRestriction && dietaryRestriction !== "None"
          ? ` that is ${dietaryRestriction.toLowerCase()}`
          : ""
      }${servings ? ` for ${servings} ${servings === "1" ? "person" : "people"}` : ""}. ${message}`;
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
          servings: isEdit ? undefined : servings,
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
    setSelectedPeople("2");
    setCustomMeal("");
    setCustomCuisine("");
    setCustomDiet("");
    localStorage.removeItem("chatHistory");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Coming Soon",
        description: "Image upload functionality will be available soon!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto max-w-4xl px-4 py-6 pt-20">
        <Card className="p-6 bg-card/50 shadow-lg border-primary/20">
          <div className="space-y-8">
            <FilterSection
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
              selectedPeople={selectedPeople}
              setSelectedPeople={setSelectedPeople}
            />

            <ImageUploadSection onFileUpload={handleFileUpload} />

            <ChatSection
              chatHistory={chatHistory}
              isLoading={isLoading}
              onSend={handleSend}
              selectedMeal={selectedMeal}
              selectedCuisine={selectedCuisine}
              customMeal={customMeal}
              customCuisine={customCuisine}
              selectedPeople={selectedPeople}
              onReset={handleReset}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;