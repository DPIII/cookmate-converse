import { useImageAnalysis } from "../image-analysis/useImageAnalysis";
import { ImageUploadInput } from "../image-analysis/ImageUploadInput";
import { ImageAnalysisButton } from "../image-analysis/ImageAnalysisButton";

interface ImageUploadSectionProps {
  onAnalysisComplete: (analysis: string) => void;
}

export const ImageUploadSection = ({ onAnalysisComplete }: ImageUploadSectionProps) => {
  const {
    isLoading,
    handleFileChange,
    handleUpload,
  } = useImageAnalysis({ onAnalysisComplete });

  return (
    <div className="border-b pb-8">
      <p className="text-lg font-medium mb-4 text-primary">
        Upload a picture of a meal, recipe, or menu item
      </p>
      <div className="flex gap-4">
        <ImageUploadInput onChange={handleFileChange} />
        <ImageAnalysisButton 
          isLoading={isLoading} 
          onClick={handleUpload}
        />
      </div>
    </div>
  );
};