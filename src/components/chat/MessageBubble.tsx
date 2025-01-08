interface Message {
  role: "user" | "assistant";
  content: string;
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Main titles (ends with :)
      if (line.trim().endsWith(':')) {
        return `<h3 class="font-bold underline mb-2">${line}</h3>`;
      }
      // Categories or numbered items (including wine names)
      if (/^\d+\./.test(line.trim()) || /^[A-Z][A-Za-z\s]+(Wine|Red|White|Rosé|Sparkling)?:/.test(line.trim())) {
        return `<p class="font-bold mb-1">${line}</p>`;
      }
      // Regular descriptive text
      return `<p class="mb-1">${line}</p>`;
    }).join('');
  };

  return (
    <div
      className={`mb-4 p-4 rounded-lg ${
        isUser
          ? "bg-primary/20 ml-auto max-w-[80%] text-left"
          : "bg-accent/20 mr-auto max-w-[90%] sm:max-w-[85%] whitespace-pre-wrap text-left font-serif leading-relaxed mx-auto"
      }`}
    >
      {isUser ? (
        message.content
      ) : (
        <div 
          className="prose prose-green max-w-none [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:my-0"
          dangerouslySetInnerHTML={{ __html: formatText(message.content) }} 
        />
      )}
    </div>
  );
};