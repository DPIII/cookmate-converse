import { Button } from "@/components/ui/button";
import { Wine } from "lucide-react";

interface WineAnalysisButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const WineAnalysisButton = ({ isLoading, onClick }: WineAnalysisButtonProps) => {
  return (
    <Button 
      variant="default"
      className="w-full bg-primary-700 hover:bg-primary-800 text-white"
      onClick={onClick}
      disabled={isLoading}
    >
      <Wine className="h-4 w-4 mr-2" />
      {isLoading ? "Processing..." : "Decode My Wine List"}
    </Button>
  );
};