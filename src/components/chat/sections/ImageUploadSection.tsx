import { useState } from "react";
import { useImageAnalysis } from "../image-analysis/useImageAnalysis";
import { ImageUploadInput } from "../image-analysis/ImageUploadInput";
import { ImageAnalysisButton } from "../image-analysis/ImageAnalysisButton";
import { WineAnalysisButton } from "../image-analysis/WineAnalysisButton";
import { WineAnalysisDialog } from "../WineAnalysisDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadSectionProps {
  onAnalysisComplete: (analysis: string) => void;
}

export const ImageUploadSection = ({ onAnalysisComplete }: ImageUploadSectionProps) => {
  const {
    isLoading,
    handleFileChange,
    handleUpload,
  } = useImageAnalysis({ onAnalysisComplete });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isWineDialogOpen, setIsWineDialogOpen] = useState(false);
  const [wineAnalysis, setWineAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event);
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleWineAnalysis = async () => {
    if (!previewUrl) {
      toast({
        title: "No image selected",
        description: "Please upload an image of a wine list first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload image to get public URL
      const fileExt = "png";
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, await (await fetch(previewUrl)).blob());

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName);

      // Analyze the wine list
      const { data, error } = await supabase.functions.invoke('analyze-wine-list', {
        body: { imageUrl: publicUrl },
      });

      if (error) throw error;

      setWineAnalysis(data.analysis);
      setIsWineDialogOpen(true);
    } catch (error) {
      console.error('Error analyzing wine list:', error);
      toast({
        title: "Error",
        description: "Failed to analyze wine list. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border-b pb-8">
      <p className="text-lg font-medium mb-6 text-primary text-center">
        <em>Upload a picture of a meal, recipe, or menu item</em>
      </p>
      <div className="flex flex-col gap-6">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <ImageUploadInput onChange={handleImageChange} />
          </div>
        </div>
        <div className="space-y-4 max-w-md mx-auto w-full">
          <ImageAnalysisButton 
            isLoading={isLoading} 
            onClick={handleUpload}
          />
          <WineAnalysisButton 
            isLoading={isLoading}
            onClick={handleWineAnalysis}
          />
        </div>
        {previewUrl && (
          <div className="flex justify-center mt-4">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-[200px] h-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
      <WineAnalysisDialog
        open={isWineDialogOpen}
        onOpenChange={setIsWineDialogOpen}
        analysis={wineAnalysis}
      />
    </div>
  );
};