import { Home, Book, List, Users, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { UserMenu } from "./UserMenu";

interface MobileNavProps {
  session: Session | null;
  handleLogout: () => Promise<void>;
}

export const MobileNav = ({ session, handleLogout }: MobileNavProps) => {
  if (!session) return null;

  return (
    <div className="flex items-center gap-4 w-full overflow-x-auto scrollbar-hide py-1.5 -mx-1 px-1">
      <Link 
        to="/directory" 
        className="text-green-600 hover:bg-green-50 p-2.5 rounded-full flex-shrink-0 touch-manipulation"
        aria-label="Home"
      >
        <Home className="h-6 w-6" />
      </Link>
      <Link 
        to="/chat" 
        className="text-green-600 hover:bg-green-50 p-2.5 rounded-full flex-shrink-0 touch-manipulation"
        aria-label="Recipe Maker"
      >
        <Book className="h-6 w-6" />
      </Link>
      <Link 
        to="/timeline" 
        className="text-green-600 hover:bg-green-50 p-2.5 rounded-full flex-shrink-0 touch-manipulation"
        aria-label="Friends"
      >
        <Users className="h-6 w-6" />
      </Link>
      <Link 
        to="/recipes" 
        className="text-green-600 hover:bg-green-50 p-2.5 rounded-full flex-shrink-0 touch-manipulation"
        aria-label="Recipes"
      >
        <List className="h-6 w-6" />
      </Link>
      <Link 
        to="/chef" 
        className="text-green-600 hover:bg-green-50 p-2.5 rounded-full flex-shrink-0 touch-manipulation"
        aria-label="Chef Chat"
      >
        <ChefHat className="h-6 w-6" />
      </Link>
      <div className="ml-auto flex-shrink-0">
        <UserMenu session={session} handleLogout={handleLogout} />
      </div>
    </div>
  );
};