import { Button } from "@/components/ui/button";
import { ShareButton } from "./ShareButton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { RecipeTitleEditor } from "./RecipeTitleEditor";
import { RatingStars } from "./RatingStars";
import { MoreVertical, Trash, ShoppingCart } from "lucide-react";

interface RecipeDialogHeaderProps {
  recipe: any;
  editingTitle: boolean;
  newTitle: string;
  onNewTitleChange: (value: string) => void;
  onEditTitleClick: () => void;
  onSaveTitleClick: () => void;
  onCancelEditClick: () => void;
  onShare: () => void;
  onDelete: () => void;
  tempRating: number | null;
  onRatingChange: (rating: number) => void;
  onSaveRating: () => void;
  isDeleting: boolean;
  onShoppingListClick?: () => void;
  generatingList?: boolean;
}

export const RecipeDialogHeader = ({
  recipe,
  editingTitle,
  newTitle,
  onNewTitleChange,
  onEditTitleClick,
  onSaveTitleClick,
  onCancelEditClick,
  onShare,
  onDelete,
  tempRating,
  onRatingChange,
  onSaveRating,
  isDeleting,
  onShoppingListClick,
  generatingList = false,
}: RecipeDialogHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 flex-1">
          <RecipeTitleEditor
            title={recipe.title}
            isEditing={editingTitle}
            newTitle={newTitle}
            onNewTitleChange={onNewTitleChange}
            onEditClick={onEditTitleClick}
            onSaveClick={onSaveTitleClick}
            onCancelClick={onCancelEditClick}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <RatingStars
          rating={recipe.rating}
          tempRating={tempRating}
          onRatingChange={onRatingChange}
          onSaveRating={onSaveRating}
        />
        <div className="flex gap-2">
          {onShoppingListClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShoppingListClick}
              disabled={generatingList}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {generatingList ? "Generating..." : "Shopping List"}
            </Button>
          )}
          <ShareButton onClick={onShare} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Recipe
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove this recipe?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the recipe from your saved recipes. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={onDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Removing..." : "Remove"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};