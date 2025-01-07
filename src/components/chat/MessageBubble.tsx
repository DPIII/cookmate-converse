interface Message {
  role: "user" | "assistant";
  content: string;
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  const formatRecipeText = (text: string) => {
    // Split text into lines
    return text.split('\n').map((line, index) => {
      // Format main headers (lines that end with a colon)
      if (line.trim().endsWith(':')) {
        return `<strong><u>${line}</u></strong>`;
      }
      // Format sub-headers (lines that start with a number followed by a period)
      if (/^\d+\./.test(line.trim())) {
        return `<strong>${line}</strong>`;
      }
      return line;
    }).join('\n');
  };

  return (
    <div
      className={`mb-4 p-4 rounded-lg ${
        isUser
          ? "bg-primary/20 ml-auto max-w-[80%] text-left"
          : "bg-accent/20 mr-auto max-w-[80%] whitespace-pre-wrap text-left font-serif leading-relaxed"
      }`}
    >
      {isUser ? (
        message.content
      ) : (
        <div 
          className="prose prose-green max-w-none"
          dangerouslySetInnerHTML={{ __html: formatRecipeText(message.content) }} 
        />
      )}
    </div>
  );
};