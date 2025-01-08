import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const FeatureCard = ({ title, description, icon: Icon, onClick }: FeatureCardProps) => {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="rounded-lg bg-green-50 p-4">
          <Icon className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </Card>
  );
};