import { RecipeFilters } from "@/components/chat/RecipeFilters";

interface FilterSectionProps {
  selectedMeal?: string;
  setSelectedMeal: (value: string) => void;
  selectedCuisine?: string;
  setSelectedCuisine: (value: string) => void;
  selectedDiet?: string;
  setSelectedDiet: (value: string) => void;
  customMeal: string;
  setCustomMeal: (value: string) => void;
  customCuisine: string;
  setCustomCuisine: (value: string) => void;
  customDiet: string;
  setCustomDiet: (value: string) => void;
  selectedPeople: string;
  setSelectedPeople: (value: string) => void;
}

export const FilterSection = ({
  selectedMeal,
  setSelectedMeal,
  selectedCuisine,
  setSelectedCuisine,
  selectedDiet,
  setSelectedDiet,
  customMeal,
  setCustomMeal,
  customCuisine,
  setCustomCuisine,
  customDiet,
  setCustomDiet,
  selectedPeople,
  setSelectedPeople,
}: FilterSectionProps) => {
  return (
    <div className="border-b pb-8">
      <RecipeFilters
        selectedMeal={selectedMeal}
        setSelectedMeal={setSelectedMeal}
        selectedCuisine={selectedCuisine}
        setSelectedCuisine={setSelectedCuisine}
        selectedDiet={selectedDiet}
        setSelectedDiet={setSelectedDiet}
        customMeal={customMeal}
        setCustomMeal={setCustomMeal}
        customCuisine={customCuisine}
        setCustomCuisine={setCustomCuisine}
        customDiet={customDiet}
        setCustomDiet={setCustomDiet}
        selectedPeople={selectedPeople}
        setSelectedPeople={setSelectedPeople}
      />
    </div>
  );
};