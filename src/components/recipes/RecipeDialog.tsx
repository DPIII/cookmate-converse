import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Share2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
                {editingTitle ? (
                  <div className="flex gap-2 w-full">
                    <Input
                      value={newTitle}
                      onChange={(e) => onNewTitleChange(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={onSaveTitleClick}>Save</Button>
                    <Button variant="outline" onClick={onCancelEditClick}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <DialogTitle>{recipe.title}</DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onEditTitleClick}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleShare}
              className="self-start"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              Saved on {format(new Date(recipe.created_at), 'MMMM d, yyyy')}
            </div>
            <div className="whitespace-pre-wrap">{recipe.content}</div>
            <div className="flex gap-2 mt-4">
              {recipe.meal_type && (
                <span className="inline-block text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {recipe.meal_type}
                </span>
              )}
              {recipe.cuisine_type && (
                <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {recipe.cuisine_type}
                </span>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};