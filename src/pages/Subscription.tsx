import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Basic recipe generation",
      "Save up to 5 recipes",
      "Community access",
      "Basic AI chat support"
    ]
  },
  {
    name: "Community",
    price: "$5",
    priceId: "price_1Qf8oRFJOjsdKhod3HBH9B0Q",
    interval: "month",
    description: "Learning the ropes or need inspiration",
    features: [
      "Everything in Free",
      "Save up to 50 recipes",
      "Advanced recipe customization",
      "Priority support",
      "Recipe collections",
      "Share recipes with friends"
    ]
  },
  {
    name: "Premium",
    price: "$10",
    priceId: "price_1Qf8q2FJOjsdKhodwzKbe9HQ",
    interval: "month",
    description: "Looking for lifechanging food and eats",
    features: [
      "Everything in Community",
      "Unlimited recipe saves",
      "Custom recipe collections",
      "Advanced AI chef assistance",
      "Priority feature access",
      "Recipe analytics",
      "Personal recipe coach"
    ]
  }
];

const Subscription = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubscribe = async (planName: string, priceId?: string) => {
    if (!session) {
      toast.error("Please login to subscribe");
      return;
    }

    setLoading(planName);
    try {
      if (planName === "Free") {
        // For free plan, directly navigate to the directory
        toast.success("Welcome to Chef's Assistant!");
        navigate("/directory");
        return;
      }

      // For paid plans, create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
      });

      if (error) throw error;
      
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to start subscription process");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto pt-20 px-4">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <ChefHat className="h-16 w-16 text-primary-700" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your cooking journey. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col relative ${
              plan.name === 'Premium' 
                ? 'border-green-500 shadow-lg transform hover:scale-105 transition-transform duration-200' 
                : plan.name === 'Free' 
                ? 'bg-gray-100 border-gray-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            {plan.name === 'Premium' && (
              <div className="absolute -top-4 left-0 right-0 text-center">
                <span className="bg-primary-700 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className={`flex items-center justify-between ${
                plan.name === 'Premium' ? 'text-primary-700' : 'text-gray-700'
              }`}>
                {plan.name}
              </CardTitle>
              <CardDescription className="min-h-[50px]">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <span className={`text-4xl font-bold ${
                  plan.name === 'Premium' ? 'text-primary-700' : 'text-gray-700'
                }`}>
                  {plan.price}
                </span>
                {plan.interval && (
                  <span className="text-gray-600">/{plan.interval}</span>
                )}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${
                      plan.name === 'Premium' ? 'text-primary-700' : 'text-gray-500'
                    }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${
                  plan.name === 'Premium' 
                    ? 'bg-primary-700 hover:bg-primary-800' 
                    : plan.name === 'Free' 
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    : 'bg-gray-700 hover:bg-gray-800 text-white'
                }`}
                onClick={() => handleSubscribe(plan.name, plan.priceId)}
                disabled={loading === plan.name}
              >
                {loading === plan.name ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : plan.name === "Free" ? (
                  "Get Started"
                ) : (
                  `Subscribe to ${plan.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>All plans include access to our core features and community support.</p>
        <p>Prices are in USD. Cancel or change your plan at any time.</p>
      </div>
    </div>
  );
};

export default Subscription;