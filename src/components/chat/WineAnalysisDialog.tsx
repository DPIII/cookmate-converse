import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WineAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: string | null;
}

export const WineAnalysisDialog = ({
  open,
  onOpenChange,
  analysis,
}: WineAnalysisDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Wine List Analysis</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4">
          <div className="whitespace-pre-wrap font-serif">
            {analysis}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};