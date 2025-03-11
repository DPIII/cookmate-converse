export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatInterfaceProps {
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