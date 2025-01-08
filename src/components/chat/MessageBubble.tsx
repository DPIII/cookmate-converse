interface Message {
  role: "user" | "assistant";
  content: string;
}

const formatLine = (line: string): string => {
  const trimmedLine = line.trim();
  
  // Main titles (ends with :)
  if (trimmedLine.endsWith(':')) {
    return `<h3 class="font-bold underline mb-2">${trimmedLine}</h3>`;
  }
  
  // Categories or numbered items (including wine names)
  if (/^\d+\./.test(trimmedLine) || 
      /^[A-Z][A-Za-z\s]+(Wine|Red|White|Rosé|Sparkling)?:/.test(trimmedLine)) {
    return `<p class="font-bold mb-1">${trimmedLine}</p>`;
  }
  
  // Regular descriptive text
  return `<p class="mb-1">${trimmedLine}</p>`;
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  const formatText = (text: string): string => {
    return text.split('\n').map(formatLine).join('');
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