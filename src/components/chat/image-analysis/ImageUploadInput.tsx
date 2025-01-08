import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ImageUploadInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadInput = ({ onChange }: ImageUploadInputProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <Input
        type="file"
        accept="image/*"
        onChange={onChange}
        className={cn(
          "flex h-10 items-center justify-center",
          "bg-gray-100 hover:bg-gray-200 transition-colors",
          "file:mr-4 file:py-2 file:px-4",
          "file:rounded-md file:border-0",
          "file:text-sm file:font-semibold",
          "file:bg-gray-200 file:text-gray-700",
          "hover:file:bg-gray-300",
          "text-gray-500 italic"
        )}
      />
    </div>
  );
};