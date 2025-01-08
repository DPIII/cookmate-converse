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
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
      }
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
      // Upload image to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName);

      console.log('Image uploaded, public URL:', publicUrl);

      // Analyze the image using the Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageUrl: publicUrl },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data?.analysis) {
        throw new Error('No analysis received from the API');
      }

      toast({
        title: "Analysis Complete",
        description: "Image analyzed successfully. Generating recipe suggestions...",
      });

      onAnalysisComplete(data.analysis);

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process the image. Please try again.",
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