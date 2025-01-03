import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface RecipeFiltersProps {
  selectedMeal?: string;
  setSelectedMeal: (value: string) => void;
  selectedCuisine?: string;
  setSelectedCuisine: (value: string) => void;
  customMeal: string;
  setCustomMeal: (value: string) => void;
  customCuisine: string;
  setCustomCuisine: (value: string) => void;
}

export const MEAL_TYPES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
  "Other",
];

export const CUISINES = [
  "Italian",
  "American",
  "Mexican",
  "Chinese",
  "Indian",
  "Japanese",
  "Mediterranean",
  "French",
  "Other",
];

export const RecipeFilters = ({
  selectedMeal,
  setSelectedMeal,
  selectedCuisine,
  setSelectedCuisine,
  customMeal,
  setCustomMeal,
  customCuisine,
  setCustomCuisine,
}: RecipeFiltersProps) => {
  return (
    <div className="space-y-4 mb-4">
      <div>
        <h3 className="text-lg font-medium mb-2 text-green-700">Type of Meal</h3>
        <ToggleGroup
          type="single"
          value={selectedMeal}
          onValueChange={setSelectedMeal}
          className="flex flex-wrap gap-2"
        >
          {MEAL_TYPES.map((type) => (
            <ToggleGroupItem
              key={type}
              value={type}
              className="bg-white border-green-200 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
            >
              {type}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {selectedMeal === "Other" && (
          <Input
            placeholder="Enter custom meal type"
            value={customMeal}
            onChange={(e) => setCustomMeal(e.target.value)}
            className="mt-2 max-w-xs"
          />
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2 text-green-700">
          Type of Cuisine
        </h3>
        <ToggleGroup
          type="single"
          value={selectedCuisine}
          onValueChange={setSelectedCuisine}
          className="flex flex-wrap gap-2"
        >
          {CUISINES.map((cuisine) => (
            <ToggleGroupItem
              key={cuisine}
              value={cuisine}
              className="bg-white border-green-200 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
            >
              {cuisine}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {selectedCuisine === "Other" && (
          <Input
            placeholder="Enter custom cuisine type"
            value={customCuisine}
            onChange={(e) => setCustomCuisine(e.target.value)}
            className="mt-2 max-w-xs"
          />
        )}
      </div>
    </div>
  );
};