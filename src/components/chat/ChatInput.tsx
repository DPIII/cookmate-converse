import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  isEditing: boolean;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput = ({
  message,
  isLoading,
  isEditing,
  onMessageChange,
  onSend,
  onKeyPress,
}: ChatInputProps) => {
  return (
    <div className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder={isEditing ? "Describe your modifications to the recipe..." : "Ask for a specific recipe or dietary requirements..."}
        className="flex-1 bg-white border-primary/20"
        onKeyPress={onKeyPress}
        disabled={isLoading}
      />
      <Button
        onClick={onSend}
        className="bg-primary hover:bg-primary/90 text-white"
        disabled={isLoading}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};