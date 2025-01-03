interface Message {
  role: "user" | "assistant";
  content: string;
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";
  return (
    <div
      className={`mb-4 p-3 rounded-lg ${
        isUser
          ? "bg-primary/20 ml-auto max-w-[80%] text-left"
          : "bg-accent/20 mr-auto max-w-[80%] whitespace-pre-wrap text-right font-serif leading-relaxed"
      }`}
    >
      {message.content}
    </div>
  );
};