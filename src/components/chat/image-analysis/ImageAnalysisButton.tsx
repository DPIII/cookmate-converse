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
      className="w-full bg-primary-800 hover:bg-primary-900 text-white"
      onClick={onClick}
      disabled={isLoading}
    >
      <Upload className="h-4 w-4 mr-2" />
      {isLoading ? "Processing..." : "Generate Recipe"}
    </Button>
  );
};