import { Home, MessageSquare, List, LogOut, Clock, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navigation = () => {
  const { session } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  if (isMobile) {
    return (
      <nav className="bg-white border-b border-green-100 fixed top-0 w-full z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link 
            to="/" 
            className="text-green-700 hover:bg-green-50 p-2 rounded-full"
            aria-label="AnyRecipe Home"
          >
            <Home className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/chat" 
              className="text-green-600 hover:bg-green-50 p-2 rounded-full"
              aria-label="Chat"
            >
              <MessageSquare className="h-6 w-6" />
            </Link>
            <Link 
              to="/timeline" 
              className="text-green-600 hover:bg-green-50 p-2 rounded-full"
              aria-label="Timeline"
            >
              <Clock className="h-6 w-6" />
            </Link>
            <Link 
              to="/recipes" 
              className="text-green-600 hover:bg-green-50 p-2 rounded-full"
              aria-label="Recipes"
            >
              <List className="h-6 w-6" />
            </Link>
            <Link 
              to="/chef" 
              className="text-green-600 hover:bg-green-50 p-2 rounded-full"
              aria-label="Chef Chat"
            >
              <ChefHat className="h-6 w-6" />
            </Link>
            {session && (
              <button
                onClick={handleLogout}
                className="text-green-600 hover:bg-green-50 p-2 rounded-full"
                aria-label="Logout"
              >
                <LogOut className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-green-100 px-4 py-3 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold text-green-700 flex items-center gap-2">
            <Home className="h-5 w-5" />
            AnyRecipe
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" asChild>
              <Link to="/chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Link>
            </Button>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" asChild>
              <Link to="/timeline">
                <Clock className="h-4 w-4 mr-2" />
                Timeline
              </Link>
            </Button>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" asChild>
              <Link to="/recipes">
                <List className="h-4 w-4 mr-2" />
                Recipes
              </Link>
            </Button>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" asChild>
              <Link to="/chef">
                <ChefHat className="h-4 w-4 mr-2" />
                Chef Chat
              </Link>
            </Button>
          </div>
        </div>
        {session && (
          <Button 
            variant="outline" 
            className="border-green-200 text-green-600 hover:bg-green-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};