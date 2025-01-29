import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "./LoadingSpinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "lucide-react";
import { Message } from "./types";
import { ShoppingListDialog } from "./actions/ShoppingListDialog";

interface SaveRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, notes: string, generatePhoto: boolean) => Promise<void>;
  isGeneratingImage: boolean;
  generatedImage: string | null;
  recipe: Message;
}

export const SaveRecipeDialog = ({
  open,
  onOpenChange,
  onSave,
  isGeneratingImage,
  generatedImage,
  recipe,
}: SaveRecipeDialogProps) => {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeNotes, setRecipeNotes] = useState("");
  const [generatePhoto, setGeneratePhoto] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);

  const handleSave = async () => {
    await onSave(recipeTitle, recipeNotes, generatePhoto);
    setRecipeTitle("");
    setRecipeNotes("");
    setGeneratePhoto(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Save Recipe</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShoppingListOpen(true)}
                className="ml-4"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                See Shopping List
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex gap-6 overflow-hidden">
            {/* Recipe Preview */}
            <ScrollArea className="flex-1 p-6 bg-gray-50 rounded-lg">
              <div 
                className="prose prose-green max-w-none 
                  [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:my-0
                  [&>h3]:text-xl [&>h3]:font-semibold
                  [&>p]:text-base [&>p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: recipe.content }}
              />
            </ScrollArea>

            {/* Save Form */}
            <div className="w-96 flex flex-col">
              <ScrollArea className="flex-1">
                <div className="space-y-4 pr-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Recipe Name</Label>
                    <Input
                      id="title"
                      placeholder="Enter recipe name"
                      value={recipeTitle}
                      onChange={(e) => setRecipeTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes about this recipe..."
                      value={recipeNotes}
                      onChange={(e) => setRecipeNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="generate-photo"
                      checked={generatePhoto}
                      onCheckedChange={setGeneratePhoto}
                    />
                    <Label htmlFor="generate-photo" className="cursor-pointer">
                      Generate Recipe Photo
                    </Label>
                  </div>
                  {isGeneratingImage && (
                    <div className="text-center py-4">
                      <LoadingSpinner />
                      <p className="text-sm text-gray-500 mt-2">Generating recipe image...</p>
                    </div>
                  )}
                  {generatedImage && (
                    <div className="space-y-2">
                      <Label>Generated Image</Label>
                      <img
                        src={generatedImage}
                        alt="Generated recipe"
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="flex justify-end gap-4 pt-4 border-t mt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Recipe
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ShoppingListDialog
        open={shoppingListOpen}
        onOpenChange={setShoppingListOpen}
        generatingList={false}
        shoppingList={recipe.content}
      />
    </>
  );
};