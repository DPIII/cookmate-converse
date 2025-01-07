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

  return (
    <ScrollArea 
      className={`${
        hasMessages 
          ? "h-[50vh] sm:h-[400px]" 
          : "h-[100px] sm:h-[150px]"
      } border border-primary/10 rounded-lg p-2 sm:p-4 mb-4 bg-white transition-all duration-300`}
    >
      <MessageList messages={messages} />
      {isLoading && <LoadingSpinner />}
    </ScrollArea>
  );
};