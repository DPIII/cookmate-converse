import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/chat");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-cream-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Welcome to AnyRecipe
          </h1>
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
        </div>
      </div>
    </div>
  );
};

export default Login;