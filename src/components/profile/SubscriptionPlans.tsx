import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Plan {
  name: string;
  displayName: string;
  priceId: string;
  price: string;
}

interface SubscriptionPlansProps {
  currentTier: string;
  onSubscribe: (planName: string, priceId: string) => Promise<void>;
  isLoading: string | null;
}

export const SubscriptionPlans = ({ currentTier, onSubscribe, isLoading }: SubscriptionPlansProps) => {
  const plans = [
    {
      name: "community",
      displayName: "Community",
      priceId: "price_1Qf8oRFJOjsdKhod3HBH9B0Q",
      price: "$5/month"
    },
    {
      name: "premium",
      displayName: "Premium",
      priceId: "price_1Qf8q2FJOjsdKhodwzKbe9HQ",
      price: "$10/month"
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {plans.map((plan) => (
        currentTier !== plan.name && (
          <Button
            key={plan.name}
            onClick={() => onSubscribe(plan.name, plan.priceId)}
            variant="outline"
            size="sm"
            disabled={isLoading === plan.name}
          >
            {isLoading === plan.name ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              `${currentTier === 'free' ? 'Upgrade to' : 'Switch to'} ${plan.displayName} (${plan.price})`
            )}
          </Button>
        )
      ))}
    </div>
  );
};