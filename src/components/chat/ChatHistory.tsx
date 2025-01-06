import { Message } from "./types";
import { MessageContainer } from "./MessageContainer";

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatHistory = ({ messages, isLoading }: ChatHistoryProps) => {
  return <MessageContainer messages={messages} isLoading={isLoading} />;
};