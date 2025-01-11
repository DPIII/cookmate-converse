import { Home, Book, List, Users, ChefHat, User, CreditCard, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "@supabase/supabase-js";

interface MobileNavProps {
  session: Session | null;
  handleLogout: () => Promise<void>;
}

export const MobileNav = ({ session, handleLogout }: MobileNavProps) => {
  if (!session) return null;

  return (
    <div className="flex items-center gap-4">
      <Link 
        to="/chat" 
        className="text-green-600 hover:bg-green-50 p-2 rounded-full"
        aria-label="Recipe Maker"
      >
        <Book className="h-6 w-6" />
      </Link>
      <Link 
        to="/timeline" 
        className="text-green-600 hover:bg-green-50 p-2 rounded-full"
        aria-label="Friends"
      >
        <Users className="h-6 w-6" />
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
      <UserMenu session={session} handleLogout={handleLogout} />
    </div>
  );
};