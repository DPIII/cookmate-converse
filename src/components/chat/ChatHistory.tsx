import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { LoadingSpinner } from "./LoadingSpinner";
import { Message } from "./types";

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatHistory = ({ messages, isLoading }: ChatHistoryProps) => {
  return (
    <ScrollArea className="h-[50vh] sm:h-[400px] border border-primary/10 rounded-lg p-2 sm:p-4 mb-4 bg-white">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
      {isLoading && <LoadingSpinner />}
    </ScrollArea>
  );
};