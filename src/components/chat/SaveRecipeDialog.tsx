import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "./LoadingSpinner";
import { Message } from "./types";

interface SaveRecipeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, notes: string, generatePhoto: boolean) => Promise<void>;
  isGeneratingImage: boolean;
  generatedImage: string | null;
}

export const SaveRecipeDialog = ({
  open,
  onOpenChange,
  onSave,
  isGeneratingImage,
  generatedImage,
}: SaveRecipeDialogProps) => {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeNotes, setRecipeNotes] = useState("");
  const [generatePhoto, setGeneratePhoto] = useState(false);

  const handleSave = async () => {
    await onSave(recipeTitle, recipeNotes, generatePhoto);
    setRecipeTitle("");
    setRecipeNotes("");
    setGeneratePhoto(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Save Recipe</DialogTitle>
          <DialogDescription>
            Give your recipe a name and add any notes you'd like to remember.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-sm text-gray-500">Generating recipe image...</p>
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
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};