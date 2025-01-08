import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "./LoadingSpinner";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  isEditing: boolean;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput = memo(({ 
  message, 
  isLoading, 
  isEditing, 
  onMessageChange, 
  onSend, 
  onKeyPress 
}: ChatInputProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <Textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={onKeyPress}
        placeholder={
          isEditing
            ? "Enter your modifications to the recipe..."
            : "What would you like to cook?"
        }
        className="min-h-[80px] flex-1"
      />
      <Button
        onClick={onSend}
        className="w-full sm:w-24"
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner /> : "Send"}
      </Button>
    </div>
  );
});

ChatInput.displayName = "ChatInput";