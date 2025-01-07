import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadSectionProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadSection = ({ onFileUpload }: ImageUploadSectionProps) => {
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Coming Soon",
      description: "Image upload functionality will be available soon!",
    });
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
          onChange={onFileUpload}
          className="flex-1"
        />
        <Button 
          variant="default" 
          className="bg-primary text-white hover:bg-primary/90"
          onClick={handleUpload}
        >
          <Upload className="h-4 w-4 mr-2" />
          Generate Recipe
        </Button>
      </div>
    </div>
  );
};