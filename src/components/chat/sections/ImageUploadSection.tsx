import { useState } from "react";
import { useImageAnalysis } from "../image-analysis/useImageAnalysis";
import { ImageUploadInput } from "../image-analysis/ImageUploadInput";
import { ImageAnalysisButton } from "../image-analysis/ImageAnalysisButton";
import { WineAnalysisButton } from "../image-analysis/WineAnalysisButton";

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
            onClick={handleUpload}
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
    </div>
  );
};