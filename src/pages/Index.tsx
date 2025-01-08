import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChefHat, ImagePlus, Library, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["recipeStats"],
    queryFn: async () => {
      const { count } = await supabase
        .from("saved_recipes")
        .select("*", { count: "exact", head: true });
      
      return {
        recipeCount: count || 0,
        savingsAmount: (count || 0) * 50
      };
    }
  });

  const features = [
    {
      title: "Generate Recipe",
      icon: <MessageSquare className="h-8 w-8 text-green-600" />,
      description: "Create personalized recipes with AI assistance",
      path: "/chat"
    },
    {
      title: "Upload Picture",
      icon: <ImagePlus className="h-8 w-8 text-green-600" />,
      description: "Generate recipes from food images",
      path: "/chat"
    },
    {
      title: "My Library",
      icon: <Library className="h-8 w-8 text-green-600" />,
      description: "Access your saved recipes",
      path: "/recipes"
    },
    {
      title: "Chef Chat",
      icon: <ChefHat className="h-8 w-8 text-green-600" />,
      description: "Get cooking advice from Chef Ramsay",
      path: "/chef"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-cream-50">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-32 sm:py-48">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-green-800 sm:text-6xl mb-8">
              Welcome to AnyRecipe
            </h1>
            <p className="text-lg leading-8 text-gray-600 mb-8 max-w-2xl mx-auto">
              Your personal AI-powered chef that helps you create delicious recipes
              tailored to your preferences, dietary needs, and available ingredients.
            </p>
            {!session && (
              <Button
                onClick={() => navigate("/login")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      {session && (
        <div className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(feature.path)}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="rounded-lg bg-green-50 p-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-green-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Community Stats Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
            <h2 className="text-3xl font-bold tracking-tight text-green-800 text-center mb-12">
              AnyRecipe Community
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="text-center">
                <p className="text-4xl font-bold tracking-tight text-green-600">
                  {stats?.recipeCount.toLocaleString()}
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-600">
                  Recipes Generated
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold tracking-tight text-green-600">
                  ${stats?.savingsAmount.toLocaleString()}
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-600">
                  Saved by Cooking at Home
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;