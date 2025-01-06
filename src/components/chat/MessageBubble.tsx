interface Message {
  role: "user" | "assistant";
  content: string;
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  const formatRecipeText = (text: string) => {
    // Format headers (lines that end with a colon)
    return text.split('\n').map((line, index) => {
      if (line.trim().endsWith(':')) {
        return `<strong><u>${line}</u></strong>`;
      }
      return line;
    }).join('\n');
  };

  return (
    <div
      className={`mb-4 p-3 rounded-lg ${
        isUser
          ? "bg-primary/20 ml-auto max-w-[80%] text-left"
          : "bg-accent/20 mr-auto max-w-[80%] whitespace-pre-wrap text-right font-serif leading-relaxed"
      }`}
    >
      {isUser ? (
        message.content
      ) : (
        <div dangerouslySetInnerHTML={{ __html: formatRecipeText(message.content) }} />
      )}
    </div>
  );
};