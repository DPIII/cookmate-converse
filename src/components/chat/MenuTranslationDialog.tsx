import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

interface MenuTranslationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translation: string | null;
}

export const MenuTranslationDialog = ({
  open,
  onOpenChange,
  translation,
}: MenuTranslationDialogProps) => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const formatTranslation = (text: string | null) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/__(.*?)__/g, '<u class="underline">$1</u>')
      .split('\n')
      .map(line => `<p class="mb-4">${line}</p>`)
      .join('');
  };

  const handleSave = async () => {
    if (!translation || !session?.user?.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .insert({
          title: 'Menu Translation',
          content: translation,
          meal_type: 'Menu Translation',
          user_id: session.user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Menu translation saved to your recipes",
      });
    } catch (error) {
      console.error('Error saving menu translation:', error);
      toast({
        title: "Error",
        description: "Failed to save menu translation",
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
          <DialogTitle>Menu Translation</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4">
          <div 
            className="prose prose-green max-w-none px-4 prose-strong:font-bold prose-p:my-2"
            dangerouslySetInnerHTML={{ 
              __html: formatTranslation(translation) 
            }}
          />
        </ScrollArea>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving || !translation || !session?.user}
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