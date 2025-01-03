import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleGuestLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'guest@example.com',
      password: 'guestpassword123',
    });

    if (error) {
      // If guest account doesn't exist, create it
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'guest@example.com',
        password: 'guestpassword123',
      });

      if (signUpError) {
        console.error('Error creating guest account:', signUpError);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-cream-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Welcome to RecipeBot</h1>
          <div className="mb-6">
            <Button 
              onClick={handleGuestLogin}
              className="w-full bg-green-600 hover:bg-green-700 mb-4"
            >
              Continue as Guest
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#94A187',
                    brandAccent: '#E07A5F',
                  },
                },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;