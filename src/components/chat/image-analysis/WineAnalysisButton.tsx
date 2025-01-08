import { Button } from "@/components/ui/button";
import { Wine } from "lucide-react";

interface WineAnalysisButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const WineAnalysisButton = ({ isLoading, onClick }: WineAnalysisButtonProps) => {
  return (
    <Button 
      variant="outline" 
      className="bg-transparent text-primary border-primary hover:bg-primary/10"
      onClick={onClick}
      disabled={isLoading}
    >
      <Wine className="h-4 w-4 mr-2" />
      {isLoading ? "Processing..." : "Decode My Wine List"}
    </Button>
  );
};