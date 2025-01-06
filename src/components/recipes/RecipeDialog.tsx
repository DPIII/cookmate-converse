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
}: RecipeDialogProps) => {
  const { toast } = useToast();
  
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
            <ShareButton onClick={handleShare} />
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4">
            <RecipeMetadata
              created_at={recipe.created_at}
              meal_type={recipe.meal_type}
              cuisine_type={recipe.cuisine_type}
            />
            <div className="whitespace-pre-wrap">{recipe.content}</div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};