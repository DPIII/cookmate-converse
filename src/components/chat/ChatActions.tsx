import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Save, Image, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoadingSpinner } from "./LoadingSpinner";
import { useState } from "react";

interface ChatActionsProps {
  onEdit: () => void;
  onSave: () => void;
  onNewRecipe: () => void;
  isLoading?: boolean;
  onGenerateImage: () => Promise<string | null>;
}

export const ChatActions = ({ 
  onEdit, 
  onSave, 
  onNewRecipe, 
  isLoading,
  onGenerateImage 
}: ChatActionsProps) => {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    setImageDialogOpen(true);
    const imageUrl = await onGenerateImage();
    setGeneratedImage(imageUrl);
    setGeneratingImage(false);
  };

  return (
    <>
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
          onClick={handleGenerateImage}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          disabled={isLoading || generatingImage}
        >
          <Image className="mr-2 h-4 w-4" />
          Generate Picture
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

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <button
            onClick={() => setImageDialogOpen(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <div className="py-4">
            {generatingImage ? (
              <div className="text-center">
                <LoadingSpinner />
                <p className="text-sm text-gray-500 mt-2">Generating image...</p>
              </div>
            ) : generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated recipe"
                className="w-full rounded-lg"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};