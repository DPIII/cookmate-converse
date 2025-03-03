import React, { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Send, Save } from "lucide-react";
import { SaveRecipeDialog } from "@/components/chat/SaveRecipeDialog";
import { useAuth } from "@/components/AuthProvider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChefChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-with-chef", {
        body: { message: userMessage },
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get chef's response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveRecipe = async (title: string, notes: string, generatePhoto: boolean) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to save recipes.",
        variant: "destructive",
      });
      return;
    }

    const lastAssistantMessage = [...messages]
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
        title,
        content: lastAssistantMessage.content,
        user_id: session.user.id,
        notes,
        image_url: null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe saved successfully!",
      });

      setIsSaveDialogOpen(false);
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((msg) => msg.role === "assistant");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto max-w-4xl px-4 py-6 pt-20">
        <Card className="p-6">
          <div className="flex flex-col mb-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-green-700">Chef Ramsay's Kitchen</h1>
            </div>
            <p className="text-muted-foreground mt-2 ml-8">Ask me cooking, recipe or life advice</p>
          </div>
          <ScrollArea className="h-[60vh] border rounded-lg p-4 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-green-100 ml-auto max-w-[80%]"
                    : "bg-gray-100 mr-auto max-w-[80%]"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
              </div>
            )}
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Chef Ramsay for cooking advice..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {messages.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => setIsSaveDialogOpen(true)}
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

      <SaveRecipeDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSaveRecipe}
        isGeneratingImage={false}
        generatedImage={generatedImage}
        recipe={lastAssistantMessage || { role: "assistant", content: "" }}
      />
    </div>
  );
};

export default ChefChat;
