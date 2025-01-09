import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session error:", sessionError);
        setError("Failed to check authentication status");
        return;
      }
      
      if (session) {
        // If user is already logged in, redirect to appropriate page
        navigate("/directory");
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN') {
        if (!session?.user) {
          setError("Authentication error: No user data");
          return;
        }

        try {
          // Check if user has an existing subscription
          const { data: subscription, error: subError } = await supabase
            .from('billing_subscriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (subError && subError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            throw subError;
          }

          // If user has no subscription, redirect to subscription page
          if (!subscription) {
            navigate("/subscription");
            return;
          }

          // If user has a subscription, redirect to directory
          navigate("/directory");
          toast.success("Welcome back!");
        } catch (error) {
          console.error("Error checking subscription:", error);
          setError("Failed to verify subscription status");
        }
      } else if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-cream-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Welcome to AnyRecipe
          </h1>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#16a34a",
                    brandAccent: "#15803d",
                  },
                },
              },
            }}
            providers={[]}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="text-green-600 hover:text-green-700 p-0"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;