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
            ? "h-[80vh] sm:h-[700px] max-w-4xl mx-auto" 
            : "h-[50vh] sm:h-[400px]"
          : "h-[100px] sm:h-[150px]"
      } rounded-lg mb-4 transition-all duration-300`}
    >
      <MessageList messages={messages} />
      {isLoading && (
        <div className="flex justify-center">
          <LoadingSpinner className="w-6 h-6 text-primary/50" />
        </div>
      )}
    </ScrollArea>
  );
};