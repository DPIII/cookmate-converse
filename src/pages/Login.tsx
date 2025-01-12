import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const intendedPath = location.state?.from?.pathname || '/';
        navigate(intendedPath);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN') {
        toast.success("Successfully logged in!");
        const intendedPath = location.state?.from?.pathname || '/';
        navigate(intendedPath);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-cream-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <ChefHat className="h-16 w-16 text-primary-700" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Welcome Back
          </h1>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/`}
            onlyThirdPartyProviders={false}
          />
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <Button
              variant="link"
              className="text-primary-600 hover:text-primary-700"
              onClick={() => navigate("/signup")}
            >
              Sign up here
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;