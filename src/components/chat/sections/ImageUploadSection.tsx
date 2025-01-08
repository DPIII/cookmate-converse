import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadSectionProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadSection = ({ onFileUpload }: ImageUploadSectionProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

      // Analyze the image using our Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageUrl: publicUrl },
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "Image analyzed successfully. You can now generate a recipe based on the analysis.",
      });

      // TODO: Pass the analysis to the chat interface for recipe generation
      console.log('Image analysis:', data.analysis);

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-b pb-8">
      <p className="text-lg font-medium mb-4 text-primary">
        Upload a picture of a meal, recipe, or menu item
      </p>
      <div className="flex gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="flex-1"
        />
        <Button 
          variant="default" 
          className="bg-primary text-white hover:bg-primary/90"
          onClick={handleUpload}
          disabled={isLoading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isLoading ? "Analyzing..." : "Generate Recipe"}
        </Button>
      </div>
    </div>
  );
};