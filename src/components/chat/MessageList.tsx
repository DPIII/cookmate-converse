import { Message } from "./types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <>
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} />
      ))}
    </>
  );
};