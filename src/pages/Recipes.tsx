import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeDialog } from "@/components/recipes/RecipeDialog";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 20;

const Recipes = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<string>("all");
  const [isSortedByRating, setIsSortedByRating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data: recipes, isLoading, refetch } = useQuery({
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

  const handleEditTitle = async () => {
    try {
      const { error } = await supabase
        .from("saved_recipes")
        .update({ title: newTitle })
        .eq("id", selectedRecipe.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe title updated successfully",
      });

      setEditingTitle(false);
      refetch();
      setSelectedRecipe(prev => ({ ...prev, title: newTitle }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recipe title",
        variant: "destructive",
      });
    }
  };

  const handleRecipeDeleted = () => {
    refetch();
  };

  const toggleSortByRating = () => {
    setIsSortedByRating(!isSortedByRating);
    setCurrentPage(1);
  };

  const filteredRecipes = recipes?.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMealType = selectedMealType === "all" || 
                           (recipe.meal_type && recipe.meal_type.toLowerCase() === selectedMealType.toLowerCase());
    return matchesSearch && matchesMealType;
  });

  const sortedRecipes = [...(filteredRecipes || [])].sort((a, b) => {
    if (!isSortedByRating) return 0;
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;
    return ratingB - ratingA;
  });

  const totalPages = Math.ceil((sortedRecipes?.length || 0) / ITEMS_PER_PAGE);
  const paginatedRecipes = sortedRecipes?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
        <div className="flex flex-col space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Recipes</h1>
          
          <RecipeFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedMealType={selectedMealType}
            onMealTypeChange={setSelectedMealType}
            onSortByRating={toggleSortByRating}
            isSortedByRating={isSortedByRating}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRecipes?.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setNewTitle(recipe.title);
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        <RecipeDialog
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => {
            setSelectedRecipe(null);
            setEditingTitle(false);
          }}
          editingTitle={editingTitle}
          newTitle={newTitle}
          onNewTitleChange={setNewTitle}
          onEditTitleClick={() => setEditingTitle(true)}
          onSaveTitleClick={handleEditTitle}
          onCancelEditClick={() => setEditingTitle(false)}
          onDelete={handleRecipeDeleted}
        />
      </div>
    </div>
  );
};

export default Recipes;