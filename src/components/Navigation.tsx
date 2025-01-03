import { Home, MessageSquare, List, LogOut } from "lucide-react";
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
      <nav className="bg-white border-b border-green-100 fixed top-0 w-full z-50 flex flex-col">
        <Link 
          to="/" 
          className="w-full py-3 px-4 flex items-center justify-center gap-2 text-green-700 hover:bg-green-50 border-b border-green-100"
        >
          <Home className="h-5 w-5" />
          <span className="font-semibold">RecipeBot</span>
        </Link>
        <div className="flex flex-col w-full">
          <Link 
            to="/chat" 
            className="w-full py-3 px-4 flex items-center justify-center gap-2 text-green-600 hover:bg-green-50 border-b border-green-100"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Chat</span>
          </Link>
          <Link 
            to="/recipes" 
            className="w-full py-3 px-4 flex items-center justify-center gap-2 text-green-600 hover:bg-green-50 border-b border-green-100"
          >
            <List className="h-5 w-5" />
            <span>Recipes</span>
          </Link>
          {session && (
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 text-green-600 hover:bg-green-50"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          )}
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
            RecipeBot
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" asChild>
              <Link to="/chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Link>
            </Button>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" asChild>
              <Link to="/recipes">
                <List className="h-4 w-4 mr-2" />
                Recipes
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