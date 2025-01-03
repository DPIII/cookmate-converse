import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Send, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Other"];
const CUISINES = ["Italian", "American", "Mexican", "Chinese", "Indian", "Japanese", "Mediterranean", "French", "Other"];

export const Chat = () => {
  const [selectedMeal, setSelectedMeal] = useState<string>();
  const [selectedCuisine, setSelectedCuisine] = useState<string>();
  const [customMeal, setCustomMeal] = useState("");
  const [customCuisine, setCustomCuisine] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant", content: string }>>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const mealType = selectedMeal === "Other" ? customMeal : selectedMeal;
    const cuisineType = selectedCuisine === "Other" ? customCuisine : selectedCuisine;
    
    const userMessage = `${mealType ? `I want a ${mealType.toLowerCase()} recipe` : "I want a recipe"}${
      cuisineType ? ` from ${cuisineType} cuisine` : ''
    }. ${message}`;
    
    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
    setMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: {
          prompt: message,
          mealType,
          cuisineType,
        },
      });

      if (error) throw error;

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

  const handleSaveRecipe = async () => {
    const lastAssistantMessage = [...chatHistory].reverse().find(msg => msg.role === "assistant");
    
    if (!lastAssistantMessage) {
      toast({
        title: "No recipe to save",
        description: "Generate a recipe first before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from('saved_recipes').insert({
        title: `Recipe for ${selectedMeal === "Other" ? customMeal : selectedMeal || "Custom Dish"}`,
        content: lastAssistantMessage.content,
        meal_type: selectedMeal === "Other" ? customMeal : selectedMeal,
        cuisine_type: selectedCuisine === "Other" ? customCuisine : selectedCuisine,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe saved successfully!",
      });
      
      // Optionally navigate to recipes page
      navigate("/recipes");
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-green-50/30">
      <Navigation />
      <div className="container mx-auto max-w-3xl px-4 py-6 pt-20">
        <Card className="p-4">
          <div className="space-y-4 mb-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-green-700">Type of Meal</h3>
              <ToggleGroup 
                type="single" 
                value={selectedMeal} 
                onValueChange={setSelectedMeal}
                className="flex flex-wrap gap-2"
              >
                {MEAL_TYPES.map((type) => (
                  <ToggleGroupItem 
                    key={type} 
                    value={type}
                    className="bg-white border-green-200 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
                  >
                    {type}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {selectedMeal === "Other" && (
                <Input
                  placeholder="Enter custom meal type"
                  value={customMeal}
                  onChange={(e) => setCustomMeal(e.target.value)}
                  className="mt-2 max-w-xs"
                />
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-green-700">Type of Cuisine</h3>
              <ToggleGroup 
                type="single" 
                value={selectedCuisine} 
                onValueChange={setSelectedCuisine}
                className="flex flex-wrap gap-2"
              >
                {CUISINES.map((cuisine) => (
                  <ToggleGroupItem 
                    key={cuisine} 
                    value={cuisine}
                    className="bg-white border-green-200 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
                  >
                    {cuisine}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {selectedCuisine === "Other" && (
                <Input
                  placeholder="Enter custom cuisine type"
                  value={customCuisine}
                  onChange={(e) => setCustomCuisine(e.target.value)}
                  className="mt-2 max-w-xs"
                />
              )}
            </div>
          </div>

          <ScrollArea className="h-[300px] border rounded-lg p-4 mb-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-green-100 ml-auto max-w-[80%]"
                    : "bg-gray-100 mr-auto max-w-[80%] whitespace-pre-wrap"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center items-center">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                  <div className="absolute top-0 left-1/2 w-1 h-6 bg-green-600 origin-bottom transform -translate-x-1/2 animate-spin"></div>
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask for a specific recipe or dietary requirements..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {chatHistory.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleSaveRecipe}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Recipe
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;