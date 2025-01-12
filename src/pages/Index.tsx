import { useAuth } from "@/components/AuthProvider";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { CommunityStats } from "@/components/home/CommunityStats";
import { TestimonialSlider } from "@/components/home/TestimonialSlider";

const Index = () => {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-cream-50">
      <HeroSection />
      <FeaturesGrid />
      <CommunityStats />
      <TestimonialSlider />
    </div>
  );
};

export default Index;