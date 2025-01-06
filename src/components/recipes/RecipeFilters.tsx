import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MEAL_TYPES } from "@/components/chat/filters/FilterConstants";

interface RecipeFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedMealType: string;
  onMealTypeChange: (value: string) => void;
}

export const RecipeFilters = ({
  searchQuery,
  onSearchChange,
  selectedMealType,
  onMealTypeChange,
}: RecipeFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedMealType} onValueChange={onMealTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by meal type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All meal types</SelectItem>
          {MEAL_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};