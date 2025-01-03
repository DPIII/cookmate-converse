import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Recipes = () => {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["saved-recipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_recipes")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 pt-20">
          <div className="animate-pulse flex justify-center items-center pt-12">
            Loading recipes...
          </div>
        </div>
      </div>
    );
  }

  if (!recipes?.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 pt-20">
          <div className="flex flex-col items-center justify-center pt-12 space-y-4">
            <p className="text-gray-600 text-lg">Oops, no saved recipes yet!</p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/chat">Create a recipe here</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 pt-20">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Recipes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">{recipe.content}</p>
                {recipe.meal_type && (
                  <span className="inline-block mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {recipe.meal_type}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipes;