import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const formatLine = (line: string): string => {
  const trimmedLine = line.trim();
  
  // Main titles (ends with :)
  if (trimmedLine.endsWith(':')) {
    return `<h3 class="font-bold text-xl md:text-2xl mb-4 text-primary">${trimmedLine}</h3>`;
  }
  
  // Categories or numbered items (including wine names)
  if (/^\d+\./.test(trimmedLine) || 
      /^[A-Z][A-Za-z\s]+(Wine|Red|White|Rosé|Sparkling)?:/.test(trimmedLine)) {
    return `<p class="font-semibold text-lg mb-3 text-primary/90">${trimmedLine}</p>`;
  }
  
  // Regular descriptive text
  return `<p class="mb-3 text-base md:text-lg leading-relaxed text-gray-700">${trimmedLine}</p>`;
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isUser = message.role === "user";

  const formatText = (text: string): string => {
    return text.split('\n').map(formatLine).join('');
  };

  // Only show assistant messages (menu output)
  if (isUser) {
    return null;
  }

  const formattedContent = formatText(message.content);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <div className="relative">
          <div 
            className="prose prose-green max-w-none 
              [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:my-0
              bg-white rounded-xl shadow-lg p-8
              border-2 border-primary/10 hover:border-primary/20 transition-all
              animate-fade-in cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
            dangerouslySetInnerHTML={{ __html: formattedContent }} 
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-primary/60 hover:text-primary"
            onClick={() => setIsDialogOpen(true)}
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <div 
              className="prose prose-green max-w-none 
                [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:my-0"
              dangerouslySetInnerHTML={{ __html: formattedContent }} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};