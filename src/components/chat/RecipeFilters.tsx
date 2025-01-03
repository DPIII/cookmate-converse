import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export const DIETARY_RESTRICTIONS = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Carb",
  "Other",
];

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
}: RecipeFiltersProps) => {
  return (
    <div className="space-y-4 mb-4">
      <div>
        <h3 className="text-lg font-medium mb-2 text-green-700">Type of Meal</h3>
        <Select value={selectedMeal} onValueChange={setSelectedMeal}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            {MEAL_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select cuisine type" />
          </SelectTrigger>
          <SelectContent>
            {CUISINES.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCuisine === "Other" && (
          <Input
            placeholder="Enter custom cuisine type"
            value={customCuisine}
            onChange={(e) => setCustomCuisine(e.target.value)}
            className="mt-2 max-w-xs"
          />
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2 text-green-700">
          Dietary Restrictions
        </h3>
        <Select value={selectedDiet} onValueChange={setSelectedDiet}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select dietary restrictions" />
          </SelectTrigger>
          <SelectContent>
            {DIETARY_RESTRICTIONS.map((diet) => (
              <SelectItem key={diet} value={diet}>
                {diet}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedDiet === "Other" && (
          <Input
            placeholder="Enter custom dietary restriction"
            value={customDiet}
            onChange={(e) => setCustomDiet(e.target.value)}
            className="mt-2 max-w-xs"
          />
        )}
      </div>
    </div>
  );
};