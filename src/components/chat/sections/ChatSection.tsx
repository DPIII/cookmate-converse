import { ChatInterface } from "@/components/chat/ChatInterface";

interface ChatSectionProps {
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>;
  isLoading: boolean;
  onSend: (message: string, isEdit?: boolean) => Promise<void>;
  selectedMeal?: string;
  selectedCuisine?: string;
  customMeal: string;
  customCuisine: string;
  selectedPeople: string;
  onReset: () => void;
}

export const ChatSection = ({
  chatHistory,
  isLoading,
  onSend,
  selectedMeal,
  selectedCuisine,
  customMeal,
  customCuisine,
  selectedPeople,
  onReset,
}: ChatSectionProps) => {
  return (
    <div>
      <ChatInterface
        chatHistory={chatHistory}
        isLoading={isLoading}
        onSend={onSend}
        selectedMeal={selectedMeal}
        selectedCuisine={selectedCuisine}
        customMeal={customMeal}
        customCuisine={customCuisine}
        selectedPeople={selectedPeople}
        onReset={onReset}
      />
    </div>
  );
};