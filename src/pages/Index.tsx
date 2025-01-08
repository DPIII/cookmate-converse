import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChefHat, DollarSign } from "lucide-react";

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
            <div className="flex justify-center gap-4">
              {!session ? (
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                >
                  Get Started
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/chat")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                >
                  Start Cooking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-green-800 sm:text-4xl">
              Everything you need to cook amazing meals
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg bg-green-50 p-4 mb-4">
                  <ChefHat className="h-8 w-8 text-green-600" />
                </div>
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  AI-Powered Recipes
                </dt>
                <dd className="mt-4 text-base leading-7 text-gray-600">
                  Get personalized recipe suggestions based on your preferences and available ingredients
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg bg-green-50 p-4 mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Save Money
                </dt>
                <dd className="mt-4 text-base leading-7 text-gray-600">
                  Cook at home and save money while enjoying delicious, restaurant-quality meals
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg bg-green-50 p-4 mb-4">
                  <ChefHat className="h-8 w-8 text-green-600" />
                </div>
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Recipe Collections
                </dt>
                <dd className="mt-4 text-base leading-7 text-gray-600">
                  Save and organize your favorite recipes in personal collections
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

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