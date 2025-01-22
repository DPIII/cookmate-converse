import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthError = async (error: AuthError) => {
    console.error("Auth error:", error);
    
    if (error.message.includes("refresh_token_not_found") || 
        error.message.includes("Invalid Refresh Token")) {
      await supabase.auth.signOut();
      setSession(null);
      localStorage.clear();
      toast.error("Session expired. Please log in again.");
      navigate("/login", { state: { from: location } });
    } else {
      toast.error(error.message || "Authentication error occurred");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = 
          await supabase.auth.getSession();
        
        if (sessionError) {
          await handleAuthError(sessionError);
        } else if (initialSession) {
          setSession(initialSession);
        }
      } catch (error) {
        console.error("Error in auth initialization:", error);
        toast.error("Error initializing authentication");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        localStorage.clear();
        navigate("/login");
      } else if (event === 'SIGNED_IN') {
        setSession(currentSession);
        if (location.pathname === '/login') {
          const intendedPath = location.state?.from?.pathname || '/';
          navigate(intendedPath);
        }
      } else if (event === 'USER_UPDATED') {
        setSession(currentSession);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  const value = {
    session,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };