import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { RecipeTitleEditor } from "./RecipeTitleEditor";
import { RecipeMetadata } from "./RecipeMetadata";
import { ShareButton } from "./ShareButton";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface RecipeDialogProps {
  recipe: any;
  isOpen: boolean;
  onClose: () => void;
  editingTitle: boolean;
  newTitle: string;
  onNewTitleChange: (value: string) => void;
  onEditTitleClick: () => void;
  onSaveTitleClick: () => void;
  onCancelEditClick: () => void;
  onDelete?: () => void;
}

export const RecipeDialog = ({
  recipe,
  isOpen,
  onClose,
  editingTitle,
  newTitle,
  onNewTitleChange,
  onEditTitleClick,
  onSaveTitleClick,
  onCancelEditClick,
  onDelete,
}: RecipeDialogProps) => {
  const { toast } = useToast();
  const [tempRating, setTempRating] = useState<number | null>(null);
  
  if (!recipe) return null;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/recipes/shared/${recipe.share_id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Recipe link has been copied to your clipboard",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleRating = async (rating: number) => {
    setTempRating(rating);
  };

  const handleSaveRating = async () => {
    if (tempRating === null) return;
    
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .update({ rating: tempRating })
        .eq('id', recipe.id);

      if (error) throw error;

      toast({
        title: "Rating saved",
        description: "Your rating has been saved successfully",
      });
      
      // Reset temp rating after saving
      setTempRating(null);
    } catch (err) {
      console.error("Failed to save rating:", err);
      toast({
        title: "Error",
        description: "Failed to save rating",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('id', recipe.id);

      if (error) throw error;

      toast({
        title: "Recipe deleted",
        description: "Your recipe has been deleted successfully",
      });

      onClose();
      if (onDelete) onDelete();
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      toast({
        title: "Error",
        description: "Failed to delete recipe",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
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
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRating(star)}
                      className={`p-1 ${
                        (tempRating ?? recipe.rating) >= star ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      <Star className="h-5 w-5" fill={(tempRating ?? recipe.rating) >= star ? 'currentColor' : 'none'} />
                    </Button>
                  ))}
                </div>
                {tempRating !== null && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveRating}
                    className="ml-2 text-xs"
                  >
                    Save Rating
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <ShareButton onClick={handleShare} />
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
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4">
            <RecipeMetadata
              created_at={recipe.created_at}
              meal_type={recipe.meal_type}
              cuisine_type={recipe.cuisine_type}
              rating={tempRating ?? recipe.rating}
            />
            <div className="whitespace-pre-wrap">{recipe.content}</div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};