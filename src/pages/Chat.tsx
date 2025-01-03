import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const CUISINES = ["Italian", "American", "Mexican", "Chinese", "Indian", "Japanese", "Mediterranean", "French"];

export const Chat = () => {
  const [selectedMeal, setSelectedMeal] = useState<string>();
  const [selectedCuisine, setSelectedCuisine] = useState<string>();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant", content: string }>>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const userMessage = `I want a ${selectedMeal?.toLowerCase() || ''} recipe${
      selectedCuisine ? ` from ${selectedCuisine} cuisine` : ''
    }. ${message}`;
    
    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
    // TODO: Implement AI response logic
    setMessage("");
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="p-6">
        <div className="space-y-4 mb-6">
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
          </div>
        </div>

        <ScrollArea className="h-[400px] border rounded-lg p-4 mb-4">
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