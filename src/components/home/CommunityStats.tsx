import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CommunityStats = () => {
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
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg ring-1 ring-gray-200">
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
  );
};