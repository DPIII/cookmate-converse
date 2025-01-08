import { useNavigate } from "react-router-dom";
import { ChefHat, ImagePlus, Library, MessageSquare } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export const FeaturesGrid = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Generate Recipe",
      icon: MessageSquare,
      description: "Create personalized recipes with AI assistance",
      path: "/chat"
    },
    {
      title: "Upload Picture",
      icon: ImagePlus,
      description: "Generate recipes from food images",
      path: "/chat"
    },
    {
      title: "My Library",
      icon: Library,
      description: "Access your saved recipes",
      path: "/recipes"
    },
    {
      title: "Chef Chat",
      icon: ChefHat,
      description: "Get cooking advice from Chef Ramsay",
      path: "/chef"
    }
  ];

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              onClick={() => navigate(feature.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};