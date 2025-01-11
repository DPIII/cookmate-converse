import { Home, Book, List, Users, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Session } from "@supabase/supabase-js";
import { UserMenu } from "./UserMenu";

interface DesktopNavProps {
  session: Session | null;
  handleLogout: () => Promise<void>;
}

export const DesktopNav = ({ session, handleLogout }: DesktopNavProps) => {
  return (
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
                <Book className="h-4 w-4 mr-2" />
                Recipe Maker
              </Link>
            </Button>
            <Button variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" asChild>
              <Link to="/timeline">
                <Users className="h-4 w-4 mr-2" />
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
      {session && <UserMenu session={session} handleLogout={handleLogout} />}
    </div>
  );
};