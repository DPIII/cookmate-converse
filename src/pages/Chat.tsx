import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FilterSection } from "@/components/chat/sections/FilterSection";
import { ImageUploadSection } from "@/components/chat/sections/ImageUploadSection";
import { ChatSection } from "@/components/chat/sections/ChatSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";

const Chat = () => {
  const [selectedMeal, setSelectedMeal] = useState<string>();
  const [selectedCuisine, setSelectedCuisine] = useState<string>();
  const [selectedDiet, setSelectedDiet] = useState<string>();
  const [selectedPeople, setSelectedPeople] = useState<string>("2");
  const [customMeal, setCustomMeal] = useState("");
  const [customCuisine, setCustomCuisine] = useState("");
  const [customDiet, setCustomDiet] = useState("");
  const [activeSection, setActiveSection] = useState<"none" | "generator" | "image">("none");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (message: string, isEdit?: boolean): Promise<void> => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message to chat history
      const newMessage = { role: "user" as const, content: message };
      setChatHistory(prev => [...prev, newMessage]);

      // Prepare the prompt with all context
      const prompt = {
        message,
        mealType: selectedMeal === "Other" ? customMeal : selectedMeal,
        cuisineType: selectedCuisine === "Other" ? customCuisine : selectedCuisine,
        dietaryRestriction: selectedDiet === "Other" ? customDiet : selectedDiet,
        servings: selectedPeople,
        isEdit,
        previousRecipe: isEdit ? chatHistory.find(msg => msg.role === "assistant")?.content : undefined
      };

      console.log('Sending recipe generation request:', prompt);

      // Call the generate-recipe edge function
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: prompt
      });

      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }

      if (!data?.recipe) {
        throw new Error('No recipe was generated');
      }

      // Add assistant response to chat history
      setChatHistory(prev => [...prev, { role: "assistant", content: data.recipe }]);

    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (): Promise<void> => {
    setChatHistory([]);
    setSelectedMeal(undefined);
    setSelectedCuisine(undefined);
    setSelectedDiet(undefined);
    setSelectedPeople("2");
    setCustomMeal("");
    setCustomCuisine("");
    setCustomDiet("");
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto max-w-4xl px-4 py-6 pt-20">
        {activeSection === "none" ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="p-8 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              onClick={() => setActiveSection("generator")}
            >
              <h2 className="text-2xl font-semibold text-primary mb-4">Recipe Generator</h2>
              <p className="text-muted-foreground italic">Generate a recipe from scratch</p>
            </Card>

            <Card 
              className="p-8 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              onClick={() => setActiveSection("image")}
            >
              <h2 className="text-2xl font-semibold text-primary mb-4">Recipe from Image</h2>
              <p className="text-muted-foreground italic">Use a photo of a dish</p>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setActiveSection("none")}
              className="mb-4 text-primary hover:text-primary/80 flex items-center gap-2"
            >
              <span>← Back to options</span>
            </button>

            {activeSection === "generator" ? (
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

                  <ChatSection
                    chatHistory={chatHistory}
                    isLoading={isLoading}
                    onSend={handleSendMessage}
                    selectedMeal={selectedMeal}
                    selectedCuisine={selectedCuisine}
                    selectedDiet={selectedDiet}
                    customMeal={customMeal}
                    customCuisine={customCuisine}
                    customDiet={customDiet}
                    selectedPeople={selectedPeople}
                    onReset={handleReset}
                  />
                </div>
              </Card>
            ) : (
              <Card className="p-6 bg-card/50 shadow-lg border-primary/20">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-primary mb-4">
                    Recipe from Image
                  </h2>
                  <ImageUploadSection onAnalysisComplete={() => {}} />
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;