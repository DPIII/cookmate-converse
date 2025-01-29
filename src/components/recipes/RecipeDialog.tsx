import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { RecipeMetadata } from "./RecipeMetadata";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { RecipeDialogHeader } from "./RecipeDialogHeader";

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
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  const handleRating = (rating: number) => {
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
      
      recipe.rating = tempRating;
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
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      console.log("Deleting recipe:", recipe.id);
      
      const { error } = await supabase
        .from('saved_recipes')
        .update({ is_deleted: true })
        .eq('id', recipe.id);

      if (error) {
        console.error("Error deleting recipe:", error);
        throw error;
      }

      console.log("Recipe deleted successfully");
      
      if (onDelete) {
        await onDelete();
      }
      
      onClose();
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      toast({
        title: "Error",
        description: "Failed to remove recipe",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <RecipeDialogHeader
            recipe={recipe}
            editingTitle={editingTitle}
            newTitle={newTitle}
            onNewTitleChange={onNewTitleChange}
            onEditTitleClick={onEditTitleClick}
            onSaveTitleClick={onSaveTitleClick}
            onCancelEditClick={onCancelEditClick}
            onShare={handleShare}
            onDelete={handleDelete}
            tempRating={tempRating}
            onRatingChange={handleRating}
            onSaveRating={handleSaveRating}
            isDeleting={isDeleting}
          />
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