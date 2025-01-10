import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

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
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                },
              },
            }}
            view="sign_in"
            showLinks={false}
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