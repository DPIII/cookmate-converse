import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const Index = () => {
  const { data: recipeStats } = useQuery({
    queryKey: ["recipe-stats"],
    queryFn: async () => {
      const { count } = await supabase
        .from("saved_recipes")
        .select("*", { count: "exact", head: true });
      
      return {
        totalRecipes: count || 0,
        moneySaved: (count || 0) * 50 // $50 per recipe
      };
    },
  });

  return (
    <div className="min-h-screen bg-green-50/30">
      <Navigation />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] pt-16">
          <Sidebar>
            <SidebarHeader className="border-b border-green-100">
              <h2 className="text-lg font-semibold text-green-700 px-4 py-2">
                Menu
              </h2>
            </SidebarHeader>
            <SidebarContent>
              {/* Sidebar content will be added when implementing chat and recipes features */}
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-12">
              <div>
                <h1 className="text-3xl font-bold text-green-800 mb-6">
                  Welcome to RecipeBot
                </h1>
                <p className="text-green-600 mb-4">
                  Start chatting with RecipeBot to discover and save your favorite recipes.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 flex flex-col h-full">
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold text-green-700 mb-3">
                        Chat with RecipeBot
                      </h2>
                      <p className="text-green-600 mb-4">
                        Ask questions, get recipe recommendations, and cooking tips.
                      </p>
                    </div>
                    <Button variant="default" className="bg-green-600 hover:bg-green-700 w-full" asChild>
                      <Link to="/chat">Start Chatting</Link>
                    </Button>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 flex flex-col h-full">
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold text-green-700 mb-3">
                        Saved Recipes
                      </h2>
                      <p className="text-green-600 mb-4">
                        Access your collection of saved recipes anytime.
                      </p>
                    </div>
                    <Button variant="default" className="bg-green-600 hover:bg-green-700 w-full" asChild>
                      <Link to="/recipes">View Recipes</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="bg-white rounded-lg shadow-sm border border-green-100 p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
                  Community Impact
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-700 mb-2">
                      {recipeStats?.totalRecipes.toLocaleString() || "0"}
                    </p>
                    <p className="text-green-600">Recipes Generated</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-700 mb-2">
                      ${recipeStats?.moneySaved.toLocaleString() || "0"}
                    </p>
                    <p className="text-green-600">Estimated Savings</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;