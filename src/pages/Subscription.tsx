import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with basic features",
    features: [
      "Basic recipe generation",
      "Save up to 10 recipes",
      "Community access"
    ]
  },
  {
    name: "Paid",
    price: "$9.99",
    interval: "month",
    description: "Perfect for cooking enthusiasts",
    features: [
      "Everything in Free",
      "Unlimited recipe generation",
      "Save unlimited recipes",
      "Custom recipe collections",
      "Priority support"
    ]
  },
  {
    name: "Premium",
    price: "$19.99",
    interval: "month",
    description: "For professional chefs and restaurants",
    features: [
      "Everything in Paid",
      "API access",
      "Custom branding",
      "Team collaboration",
      "Advanced analytics"
    ]
  }
];

const Subscription = () => {
  const { session } = useAuth();

  const handleSubscribe = async (planName: string) => {
    if (!session) {
      toast.error("Please login to subscribe");
      return;
    }

    if (planName === "Free") {
      toast.success("You are already on the Free plan");
      return;
    }

    toast.info("Stripe integration coming soon!");
  };

  return (
    <div className="container max-w-6xl mx-auto pt-20 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your cooking journey. All plans include access to our core features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.interval && (
                  <span className="text-gray-600">/{plan.interval}</span>
                )}
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.name === "Free" ? "outline" : "default"}
                onClick={() => handleSubscribe(plan.name)}
              >
                {plan.name === "Free" ? "Current Plan" : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subscription;