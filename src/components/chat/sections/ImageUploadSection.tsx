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
      <p className="text-lg font-medium mb-4 text-primary">
        <em>Upload a picture of a meal, recipe, or menu item</em>
      </p>
      <div className="flex flex-col gap-4">
        <ImageUploadInput onChange={handleImageChange} />
        <ImageAnalysisButton 
          isLoading={isLoading} 
          onClick={handleUpload}
        />
        <WineAnalysisButton 
          isLoading={isLoading}
          onClick={handleUpload}
        />
        {previewUrl && (
          <div className="mt-2">
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