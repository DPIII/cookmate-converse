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

  return (
    <div className="border-b pb-8">
      <p className="text-lg font-medium mb-4 text-primary">
        <em>Upload a picture of a meal, recipe, or menu item</em>
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <ImageUploadInput onChange={handleFileChange} />
        <div className="flex flex-row gap-2">
          <ImageAnalysisButton 
            isLoading={isLoading} 
            onClick={handleUpload}
          />
          <WineAnalysisButton 
            isLoading={isLoading}
            onClick={handleUpload}
          />
        </div>
      </div>
    </div>
  );
};