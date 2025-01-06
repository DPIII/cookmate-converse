import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Pencil, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MEAL_TYPES } from "@/components/chat/filters/FilterConstants";

const Recipes = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<string>("");
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

  const filteredRecipes = recipes?.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMealType = !selectedMealType || recipe.meal_type === selectedMealType;
    return matchesSearch && matchesMealType;
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
        <div className="flex flex-col space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Recipes</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedMealType} onValueChange={setSelectedMealType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All meal types</SelectItem>
                {MEAL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes?.map((recipe) => (
              <Card 
                key={recipe.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setNewTitle(recipe.title);
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  <CardDescription>
                    Saved on {format(new Date(recipe.created_at), 'MMMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">{recipe.content}</p>
                  <div className="flex gap-2 mt-2">
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
            ))}
          </div>
        </div>

        <Dialog open={!!selectedRecipe} onOpenChange={() => {
          setSelectedRecipe(null);
          setEditingTitle(false);
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {editingTitle ? (
                  <div className="flex gap-2 w-full">
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleEditTitle}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingTitle(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <DialogTitle>{selectedRecipe?.title}</DialogTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTitle(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  Saved on {selectedRecipe && format(new Date(selectedRecipe.created_at), 'MMMM d, yyyy')}
                </div>
                <div className="whitespace-pre-wrap">{selectedRecipe?.content}</div>
                <div className="flex gap-2 mt-4">
                  {selectedRecipe?.meal_type && (
                    <span className="inline-block text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {selectedRecipe.meal_type}
                    </span>
                  )}
                  {selectedRecipe?.cuisine_type && (
                    <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {selectedRecipe.cuisine_type}
                    </span>
                  )}
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Recipes;