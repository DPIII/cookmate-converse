import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "./navigation/MobileNav";
import { DesktopNav } from "./navigation/DesktopNav";

export const Navigation = () => {
  const { session } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  if (isMobile) {
    return (
      <nav className="bg-white border-b border-green-100 fixed top-0 left-0 right-0 w-full z-50 safe-top">
        <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto min-h-[60px]">
          <MobileNav session={session} handleLogout={handleLogout} />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-green-100 px-4 py-3 fixed top-0 w-full z-50">
      <DesktopNav session={session} handleLogout={handleLogout} />
    </nav>
  );
};