export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatInterfaceProps {
  chatHistory: Message[];
  isLoading: boolean;
  onSend: (message: string, isEdit?: boolean) => void;
  selectedMeal?: string;
  selectedCuisine?: string;
  customMeal: string;
  customCuisine: string;
  selectedPeople: string;
  onReset?: () => void;
}