import { Home, MessageSquare, List, LogOut, Clock, ChefHat, User, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            to={session ? "/directory" : "/"} 
            className="text-green-700 hover:bg-green-50 p-2 rounded-full"
            aria-label="Home"
          >
            <Home className="h-6 w-6" />
          </Link>
          {session && (
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2" aria-label="User menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/billing" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-green-100 px-4 py-3 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            to={session ? "/directory" : "/"} 
            className="text-xl font-semibold text-green-700 flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            AnyRecipe
          </Link>
          {session && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" asChild>
                <Link to="/chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Recipe Maker
                </Link>
              </Button>
              <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" asChild>
                <Link to="/timeline">
                  <Clock className="h-4 w-4 mr-2" />
                  Friends
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
          )}
        </div>
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/billing" className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};