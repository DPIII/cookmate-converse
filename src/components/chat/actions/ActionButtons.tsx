import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Save, Image, ShoppingCart } from "lucide-react";

interface ActionButtonsProps {
  onEdit: () => void;
  onSave: () => void;
  onNewRecipe: () => void;
  onGenerateImage: () => void;
  onGenerateShoppingList: () => void;
  isLoading: boolean;
  generatingImage: boolean;
  generatingList: boolean;
  hasGeneratedList: boolean;
}

export const ActionButtons = ({
  onEdit,
  onSave,
  onNewRecipe,
  onGenerateImage,
  onGenerateShoppingList,
  isLoading,
  generatingImage,
  generatingList,
  hasGeneratedList,
}: ActionButtonsProps) => {
  return (
    <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
      <Button
        onClick={onEdit}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
        disabled={isLoading}
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit Recipe
      </Button>
      <Button
        onClick={onGenerateImage}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
        disabled={isLoading || generatingImage}
      >
        <Image className="mr-2 h-4 w-4" />
        Generate Picture
      </Button>
      <Button
        onClick={onGenerateShoppingList}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
        disabled={isLoading || generatingList}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {hasGeneratedList ? "Show Shopping List" : "Generate Shopping List"}
      </Button>
      <Button
        onClick={onSave}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
        disabled={isLoading}
      >
        <Save className="mr-2 h-4 w-4" />
        Save Recipe
      </Button>
      <Button
        onClick={onNewRecipe}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto"
        disabled={isLoading}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        New Recipe
      </Button>
    </div>
  );
};