import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative px-4 pt-20 lg:px-8">
      <div className="mx-auto max-w-4xl py-12 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-green-800 sm:text-6xl mb-4">
            Welcome to AnyRecipe
          </h1>
          <p className="text-lg leading-8 text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal AI-powered chef that helps you create delicious recipes
            tailored to your preferences, dietary needs, and available ingredients.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Button 
              onClick={() => navigate("/signup")} 
              className="bg-primary-700 hover:bg-primary-800 text-white px-8 py-6 text-lg"
            >
              Create an Account
            </Button>
            <Button 
              onClick={() => navigate("/login")} 
              variant="outline"
              className="text-gray-700 hover:text-gray-900 px-8 py-6 text-lg italic border-gray-700"
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};