import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageAnalysisButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const ImageAnalysisButton = ({ isLoading, onClick }: ImageAnalysisButtonProps) => {
  return (
    <Button 
      variant="outline" 
      className="bg-transparent text-primary border-primary hover:bg-primary/10"
      onClick={onClick}
      disabled={isLoading}
    >
      <Upload className="h-4 w-4 mr-2" />
      {isLoading ? "Processing..." : "Generate Recipe"}
    </Button>
  );
};