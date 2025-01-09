import { useAuth } from "@/components/AuthProvider";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { CommunityStats } from "@/components/home/CommunityStats";
import { TestimonialSlider } from "@/components/home/TestimonialSlider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      // If user is already authenticated, redirect to recipe generator
      navigate("/chat");
    }
  }, [session, navigate]);

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