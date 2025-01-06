import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Save, Edit, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { MessageBubble } from "./MessageBubble";
import { LoadingSpinner } from "./LoadingSpinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  chatHistory: Message[];
  isLoading: boolean;
  onSend: (message: string, isEdit?: boolean) => void;
  selectedMeal?: string;
  selectedCuisine?: string;
  customMeal: string;
  customCuisine: string;
  onReset?: () => void;
}

export const ChatInterface = ({
  chatHistory,
  isLoading,
  onSend,
  selectedMeal,
  selectedCuisine,
  customMeal,
  customCuisine,
  onReset,
}: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeNotes, setRecipeNotes] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useAuth();

  const hasRecipe = chatHistory.some(msg => msg.role === "assistant");

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
        title: recipeTitle || `Recipe for ${
          selectedMeal === "Other" ? customMeal : selectedMeal || "Custom Dish"
        }`,
        content: lastAssistantMessage.content,
        meal_type: selectedMeal === "Other" ? customMeal : selectedMeal,
        cuisine_type: selectedCuisine === "Other" ? customCuisine : selectedCuisine,
        user_id: session.user.id,
        notes: recipeNotes,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe saved successfully!",
      });

      setIsSaveDialogOpen(false);
      setRecipeTitle("");
      setRecipeNotes("");
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
      onSend(message, isEditing);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    toast({
      title: "Edit Mode",
      description: "Type your modifications to the recipe",
    });
  };

  const handleNewRecipe = () => {
    if (onReset) {
      onReset();
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg border border-primary/10">
      <ScrollArea className="h-[400px] border border-primary/10 rounded-lg p-4 mb-4 bg-white">
        {chatHistory.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && <LoadingSpinner />}
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isEditing ? "Type your modifications..." : "Ask for a specific recipe or dietary requirements..."}
          className="flex-1 bg-white border-primary/20"
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {hasRecipe && (
        <div className="mt-4 flex justify-center gap-4">
          <Button
            onClick={startEditing}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Recipe
          </Button>
          <Button
            onClick={() => setIsSaveDialogOpen(true)}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Recipe
          </Button>
          <Button
            onClick={handleNewRecipe}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            New Recipe
          </Button>
        </div>
      )}

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Recipe</DialogTitle>
            <DialogDescription>
              Give your recipe a name and add any notes you'd like to remember.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Recipe Name</Label>
              <Input
                id="title"
                placeholder="Enter recipe name"
                value={recipeTitle}
                onChange={(e) => setRecipeTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this recipe..."
                value={recipeNotes}
                onChange={(e) => setRecipeNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRecipe}>
              Save Recipe
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};