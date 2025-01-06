import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { LoadingSpinner } from "@/components/chat/LoadingSpinner";

export const SharedRecipeView = () => {
  const { shareId } = useParams();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["shared-recipe", shareId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_recipes")
        .select("*")
        .eq("share_id", shareId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{recipe.title}</CardTitle>
          <p className="text-sm text-gray-500">
            Shared on {format(new Date(recipe.created_at), 'MMMM d, yyyy')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="whitespace-pre-wrap">{recipe.content}</div>
          {recipe.notes && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-gray-600">{recipe.notes}</p>
            </div>
          )}
          <div className="flex gap-2 mt-4">
            {recipe.meal_type && (
              <span className="inline-block text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {recipe.meal_type}
              </span>
            )}
            {recipe.cuisine_type && (
              <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {recipe.cuisine_type}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};