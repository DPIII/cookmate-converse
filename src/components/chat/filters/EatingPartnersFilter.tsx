import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EatingPartnersFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const EatingPartnersFilter = ({ value, onChange }: EatingPartnersFilterProps) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-medium mb-3 text-primary">Number of People</h3>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px] bg-white border-primary/20">
          <SelectValue placeholder="Select number of people" />
        </SelectTrigger>
        <SelectContent>
          {["1", "2", "3", "4", "5", "6", "More"].map((option) => (
            <SelectItem key={option} value={option}>
              {option} {option !== "More" ? (option === "1" ? "person" : "people") : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};