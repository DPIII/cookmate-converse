import { Button } from "@/components/ui/button";
import { Wine } from "lucide-react";
import { LoadingSpinner } from "../LoadingSpinner";

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
      {isLoading ? (
        <>
          <LoadingSpinner className="mr-2 h-4 w-4" />
          Analyzing...
        </>
      ) : (
        <>
          <Wine className="h-4 w-4 mr-2" />
          Decode My Wine List
        </>
      )}
    </Button>
  );
};