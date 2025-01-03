import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Other"];
const CUISINES = ["Italian", "American", "Mexican", "Chinese", "Indian", "Japanese", "Mediterranean", "French", "Other"];

export const Chat = () => {
  const [selectedMeal, setSelectedMeal] = useState<string>();
  const [selectedCuisine, setSelectedCuisine] = useState<string>();
  const [customMeal, setCustomMeal] = useState("");
  const [customCuisine, setCustomCuisine] = useState("");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant", content: string }>>([]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const mealType = selectedMeal === "Other" ? customMeal : selectedMeal;
    const cuisineType = selectedCuisine === "Other" ? customCuisine : selectedCuisine;
    
    const userMessage = `${mealType ? `I want a ${mealType.toLowerCase()} recipe` : "I want a recipe"}${
      cuisineType ? ` from ${cuisineType} cuisine` : ''
    }. ${message}`;
    
    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
    setMessage("");
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <Card className="p-4">
        <div className="space-y-4 mb-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-green-700">Type of Meal (Optional)</h3>
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
            <h3 className="text-lg font-medium mb-2 text-green-700">Type of Cuisine (Optional)</h3>
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
                  : "bg-gray-100 mr-auto max-w-[80%]"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </ScrollArea>

        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask for a specific recipe or dietary requirements..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button 
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Chat;