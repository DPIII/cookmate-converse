import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "./LoadingSpinner";
import { MessageList } from "./MessageList";
import { Message } from "./types";

interface MessageContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageContainer = ({ messages, isLoading }: MessageContainerProps) => {
  const hasMessages = messages.length > 0;
  const hasRecipe = messages.some(msg => msg.role === "assistant");

  return (
    <ScrollArea 
      className={`${
        hasMessages 
          ? hasRecipe
            ? "h-[70vh] sm:h-[600px] max-w-3xl mx-auto" 
            : "h-[50vh] sm:h-[400px]"
          : "h-[100px] sm:h-[150px]"
      } border border-primary/10 rounded-lg p-2 sm:p-4 mb-4 bg-white transition-all duration-300`}
    >
      <MessageList messages={messages} />
      {isLoading && <LoadingSpinner />}
    </ScrollArea>
  );
};