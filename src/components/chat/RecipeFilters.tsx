import { SelectFilter } from "./filters/SelectFilter";
import { MEAL_TYPES, CUISINES, DIETARY_RESTRICTIONS } from "./filters/FilterConstants";
import { EatingPartnersFilter } from "./filters/EatingPartnersFilter";

interface RecipeFiltersProps {
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

export const RecipeFilters = ({
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
}: RecipeFiltersProps) => {
  return (
    <div className="space-y-6 mb-6 bg-white p-6 rounded-lg shadow-lg border border-primary/10">
      <div className="grid grid-cols-2 gap-6">
        <SelectFilter
          label="Type of Meal"
          value={selectedMeal}
          onChange={setSelectedMeal}
          options={MEAL_TYPES}
          customValue={customMeal}
          onCustomChange={setCustomMeal}
          placeholder="Select meal type"
        />
        <SelectFilter
          label="Type of Cuisine"
          value={selectedCuisine}
          onChange={setSelectedCuisine}
          options={CUISINES}
          customValue={customCuisine}
          onCustomChange={setCustomCuisine}
          placeholder="Select cuisine type"
        />
        <SelectFilter
          label="Dietary Restrictions"
          value={selectedDiet}
          onChange={setSelectedDiet}
          options={DIETARY_RESTRICTIONS}
          customValue={customDiet}
          onCustomChange={setCustomDiet}
          placeholder="Select dietary restrictions"
        />
        <EatingPartnersFilter
          value={selectedPeople}
          onChange={setSelectedPeople}
        />
      </div>
    </div>
  );
};