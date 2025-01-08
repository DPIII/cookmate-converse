import { Input } from "@/components/ui/input";

interface ImageUploadInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadInput = ({ onChange }: ImageUploadInputProps) => {
  return (
    <Input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="flex-1 bg-transparent border-primary text-primary"
    />
  );
};