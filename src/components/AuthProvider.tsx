import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const handleAuthError = async (error: AuthError) => {
    console.error("Auth error:", error);
    
    if (error.message.includes("refresh_token_not_found") || 
        error.message.includes("Invalid Refresh Token")) {
      await supabase.auth.signOut();
      setSession(null);
      localStorage.clear();
      toast.error("Session expired. Please log in again.");
    } else {
      toast.error(error.message || "Authentication error. Please try logging in again.");
    }
  };

  const checkSubscription = async (userId: string) => {
    try {
      const { data: subscription, error } = await supabase
        .from('billing_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(); // Using maybeSingle() instead of single()

      if (error) {
        console.error("Error checking subscription:", error);
        return null;
      }

      // Log subscription status for debugging
      console.log("Subscription status:", subscription || "No subscription found");
      return subscription;
    } catch (error) {
      console.error("Error checking subscription:", error);
      return null;
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
          await checkSubscription(initialSession.user.id);
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
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(currentSession);
        if (currentSession?.user) {
          await checkSubscription(currentSession.user.id);
        }
      } else if (event === 'USER_UPDATED') {
        setSession(currentSession);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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