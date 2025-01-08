import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseImageAnalysisProps {
  onAnalysisComplete: (analysis: string) => void;
}

export const useImageAnalysis = ({ onAnalysisComplete }: UseImageAnalysisProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName);

      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageUrl: publicUrl },
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "Image analyzed successfully. Generating recipe suggestions...",
      });

      if (data.analysis) {
        onAnalysisComplete(data.analysis);
      }

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  return {
    isLoading,
    selectedFile,
    handleFileChange,
    handleUpload,
  };
};