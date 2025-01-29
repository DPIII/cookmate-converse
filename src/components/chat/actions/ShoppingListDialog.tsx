import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { LoadingSpinner } from "../LoadingSpinner";

interface ShoppingListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatingList: boolean;
  shoppingList: string | null;
}

export const ShoppingListDialog = ({
  open,
  onOpenChange,
  generatingList,
  shoppingList,
}: ShoppingListDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <div className="flex-1 overflow-auto py-4">
          {generatingList ? (
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-sm text-gray-500 mt-2">Generating shopping list...</p>
            </div>
          ) : shoppingList ? (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm font-sans">{shoppingList}</pre>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};