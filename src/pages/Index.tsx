import { useAuth } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { CommunityStats } from "@/components/home/CommunityStats";

const Index = () => {
  const { session } = useAuth();

  const MainContent = () => (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-cream-50">
      <HeroSection />
      <FeaturesGrid />
      <CommunityStats />
    </div>
  );

  return session ? (
    <ProtectedRoute>
      <MainContent />
    </ProtectedRoute>
  ) : (
    <MainContent />
  );
};

export default Index;