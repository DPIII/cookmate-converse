import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, SortAsc } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ImageUploadSection } from "../chat/sections/ImageUploadSection";

interface RecipeFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedMealType: string;
  onMealTypeChange: (value: string) => void;
  onSortByRating: () => void;
  isSortedByRating: boolean;
}

export const RecipeFilters = ({
  searchQuery,
  onSearchChange,
  selectedMealType,
  onMealTypeChange,
  onSortByRating,
  isSortedByRating,
}: RecipeFiltersProps) => {
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);

  const handleAnalysisComplete = async (analysis: string) => {
    // Close the dialog after analysis is complete
    setIsAddRecipeOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <Select value={selectedMealType} onValueChange={onMealTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by meal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="dessert">Dessert</SelectItem>
            <SelectItem value="snack">Snack</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={onSortByRating}
          className={isSortedByRating ? "bg-primary/10" : ""}
        >
          <SortAsc className="h-4 w-4 mr-2" />
          Rating
        </Button>
        <Button onClick={() => setIsAddRecipeOpen(true)} className="bg-primary text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      <Dialog open={isAddRecipeOpen} onOpenChange={setIsAddRecipeOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Recipe</DialogTitle>
          </DialogHeader>
          <ImageUploadSection onAnalysisComplete={handleAnalysisComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};