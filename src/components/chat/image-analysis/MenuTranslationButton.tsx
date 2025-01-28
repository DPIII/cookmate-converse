import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { LoadingSpinner } from "../LoadingSpinner";

interface MenuTranslationButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export const MenuTranslationButton = ({ onClick, isLoading }: MenuTranslationButtonProps) => {
  return (
    <Button 
      variant="default"
      className="w-full bg-green-700 hover:bg-green-800 text-white"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Languages className="mr-2 h-4 w-4" />
          Translate Menu
        </>
      )}
    </Button>
  );
};