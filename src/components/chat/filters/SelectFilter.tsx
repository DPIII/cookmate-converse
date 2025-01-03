import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SelectFilterProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: string[];
  customValue: string;
  onCustomChange: (value: string) => void;
  placeholder: string;
}

export const SelectFilter = ({
  label,
  value,
  onChange,
  options,
  customValue,
  onCustomChange,
  placeholder,
}: SelectFilterProps) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-medium mb-3 text-primary">{label}</h3>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px] bg-white border-primary/20">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value === "Other" && (
        <Input
          placeholder={`Enter custom ${label.toLowerCase()}`}
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          className="mt-2 max-w-xs bg-white border-primary/20"
        />
      )}
    </div>
  );
};