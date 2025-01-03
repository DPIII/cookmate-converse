import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

interface ChatInterfaceProps {
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>;
  isLoading: boolean;
  onSend: (message: string) => void;
  selectedMeal?: string;
  selectedCuisine?: string;
  customMeal: string;
  customCuisine: string;
}

export const ChatInterface = ({
  chatHistory,
  isLoading,
  onSend,
  selectedMeal,
  selectedCuisine,
  customMeal,
  customCuisine,
}: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleSaveRecipe = async () => {
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

    try {
      const { error } = await supabase.from("saved_recipes").insert({
        title: `Recipe for ${
          selectedMeal === "Other" ? customMeal : selectedMeal || "Custom Dish"
        }`,
        content: lastAssistantMessage.content,
        meal_type: selectedMeal === "Other" ? customMeal : selectedMeal,
        cuisine_type: selectedCuisine === "Other" ? customCuisine : selectedCuisine,
        user_id: session?.user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe saved successfully!",
      });

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

  return (
    <div className="space-y-4">
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
              <div className="absolute top-0 left-1/2 w-1 h-6 bg-green-600 origin-bottom transform -translate-x-1/2 animate-spin" style={{ animationDuration: '2s' }}></div>
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
          onKeyPress={(e) => e.key === "Enter" && !isLoading && onSend(message)}
          disabled={isLoading}
        />
        <Button
          onClick={() => onSend(message)}
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
    </div>
  );
};