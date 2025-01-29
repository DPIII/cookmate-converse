import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { LoadingSpinner } from "../LoadingSpinner";

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatingImage: boolean;
  generatedImage: string | null;
}

export const ImageDialog = ({ 
  open, 
  onOpenChange, 
  generatingImage, 
  generatedImage 
}: ImageDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <button
          onClick={() => onOpenChange(false)}
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
  );
};