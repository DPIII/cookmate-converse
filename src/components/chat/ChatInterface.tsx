import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  chatHistory: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  selectedMeal?: string;
  selectedCuisine?: string;
  customMeal: string;
  customCuisine: string;
}

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  return (
    <div
      className={`mb-4 p-3 rounded-lg ${
        isUser
          ? "bg-primary/20 ml-auto max-w-[80%]"
          : "bg-accent/20 mr-auto max-w-[80%] whitespace-pre-wrap"
      }`}
    >
      {message.content}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
      <div
        className="absolute top-0 left-1/2 w-1 h-6 bg-primary origin-bottom transform -translate-x-1/2 animate-spin"
        style={{ animationDuration: '2s' }}
      ></div>
    </div>
  </div>
);

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

    try {
      const { error } = await supabase.from("saved_recipes").insert({
        title: `Recipe for ${
          selectedMeal === "Other" ? customMeal : selectedMeal || "Custom Dish"
        }`,
        content: lastAssistantMessage.content,
        meal_type: selectedMeal === "Other" ? customMeal : selectedMeal,
        cuisine_type: selectedCuisine === "Other" ? customCuisine : selectedCuisine,
        user_id: session.user.id,
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

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-4 bg-card/50 p-6 rounded-lg shadow-lg">
      <ScrollArea className="h-[400px] border border-border/50 rounded-lg p-4 mb-4 bg-background/50">
        {chatHistory.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && <LoadingSpinner />}
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask for a specific recipe or dietary requirements..."
          className="flex-1 bg-background/50 border-primary/20"
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-primary hover:bg-primary/90"
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
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Recipe
          </Button>
        </div>
      )}
    </div>
  );
};