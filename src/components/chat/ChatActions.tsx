import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Save } from "lucide-react";

interface ChatActionsProps {
  onEdit: () => void;
  onSave: () => void;
  onNewRecipe: () => void;
  isLoading?: boolean;
}

export const ChatActions = ({ onEdit, onSave, onNewRecipe, isLoading }: ChatActionsProps) => {
  return (
    <div className="mt-4 flex justify-center gap-4">
      <Button
        onClick={onEdit}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10"
        disabled={isLoading}
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit Recipe
      </Button>
      <Button
        onClick={onSave}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10"
        disabled={isLoading}
      >
        <Save className="mr-2 h-4 w-4" />
        Save Recipe
      </Button>
      <Button
        onClick={onNewRecipe}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10"
        disabled={isLoading}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        New Recipe
      </Button>
    </div>
  );
};