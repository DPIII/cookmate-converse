import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Format text to preserve HTML-like formatting
  const formatAnalysis = (text: string | null) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .split('\n')
      .map(line => `<p>${line}</p>`)
      .join('');
  };

  const handleSave = async () => {
    if (!analysis) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .insert({
          title: 'Wine Analysis',
          content: analysis,
          meal_type: 'Wine Pairing',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Wine analysis saved to your recipes",
      });
    } catch (error) {
      console.error('Error saving wine analysis:', error);
      toast({
        title: "Error",
        description: "Failed to save wine analysis",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Wine List Analysis</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4">
          <div 
            className="prose prose-green max-w-none px-4"
            dangerouslySetInnerHTML={{ 
              __html: formatAnalysis(analysis) 
            }}
          />
        </ScrollArea>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving || !analysis}
            className="bg-primary text-white hover:bg-primary-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save as Recipe"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};