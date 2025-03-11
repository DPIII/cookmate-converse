import { ChatInterface } from "@/components/chat/ChatInterface";

interface ChatSectionProps {
  chatHistory: Array<{ role: "user" | "assistant"; content: string }>;
  isLoading: boolean;
  onSend: (message: string, isEdit?: boolean) => Promise<void>;
  selectedMeal?: string;
  selectedCuisine?: string;
  selectedDiet?: string;
  customMeal: string;
  customCuisine: string;
  customDiet: string;
  selectedPeople: string;
  onReset: () => void;
}

export const ChatSection = ({
  chatHistory,
  isLoading,
  onSend,
  selectedMeal,
  selectedCuisine,
  selectedDiet,
  customMeal,
  customCuisine,
  customDiet,
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
        selectedDiet={selectedDiet}
        customMeal={customMeal}
        customCuisine={customCuisine}
        customDiet={customDiet}
        selectedPeople={selectedPeople}
        onReset={onReset}
      />
    </div>
  );
};