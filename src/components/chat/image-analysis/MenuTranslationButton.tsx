import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { LoadingSpinner } from "../LoadingSpinner";

interface MenuTranslationButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const MenuTranslationButton = ({ isLoading, onClick }: MenuTranslationButtonProps) => {
  return (
    <Button 
      variant="default"
      className="w-full bg-primary-800 hover:bg-primary-900 text-white"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <LoadingSpinner className="mr-2 h-4 w-4" />
          Translating...
        </>
      ) : (
        <>
          <Languages className="h-4 w-4 mr-2" />
          Translate My Menu
        </>
      )}
    </Button>
  );
};