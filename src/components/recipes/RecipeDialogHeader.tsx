import { Button } from "@/components/ui/button";
import { ShareButton } from "./ShareButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RecipeTitleEditor } from "./RecipeTitleEditor";
import { RatingStars } from "./RatingStars";

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
          <ShareButton onClick={onShare} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your recipe.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};