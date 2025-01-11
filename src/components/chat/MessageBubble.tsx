interface Message {
  role: "user" | "assistant";
  content: string;
}

const formatLine = (line: string): string => {
  const trimmedLine = line.trim();
  
  // Main titles (ends with :)
  if (trimmedLine.endsWith(':')) {
    return `<h3 class="font-bold text-lg md:text-xl mb-3">${trimmedLine}</h3>`;
  }
  
  // Categories or numbered items (including wine names)
  if (/^\d+\./.test(trimmedLine) || 
      /^[A-Z][A-Za-z\s]+(Wine|Red|White|Rosé|Sparkling)?:/.test(trimmedLine)) {
    return `<p class="font-semibold mb-2">${trimmedLine}</p>`;
  }
  
  // Regular descriptive text
  return `<p class="mb-2 text-sm md:text-base">${trimmedLine}</p>`;
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === "user";

  const formatText = (text: string): string => {
    return text.split('\n').map(formatLine).join('');
  };

  // Only show assistant messages (menu output)
  if (isUser) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div 
        className="prose prose-green max-w-none 
          [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:my-0
          bg-white rounded-lg shadow-sm p-6
          border border-primary/10"
        dangerouslySetInnerHTML={{ __html: formatText(message.content) }} 
      />
    </div>
  );
};