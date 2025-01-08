import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageAnalysisButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const ImageAnalysisButton = ({ isLoading, onClick }: ImageAnalysisButtonProps) => {
  return (
    <Button 
      variant="default" 
      className="bg-primary text-white hover:bg-primary/90"
      onClick={onClick}
      disabled={isLoading}
    >
      <Upload className="h-4 w-4 mr-2" />
      {isLoading ? "Processing..." : "Upload & Generate Recipe"}
    </Button>
  );
};