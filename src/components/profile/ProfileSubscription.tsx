import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SubscriptionBadge } from "./SubscriptionBadge";
import { SubscriptionPlans } from "./SubscriptionPlans";

interface ProfileSubscriptionProps {
  profile: { membership_tier: string } | null;
  isLoadingProfile: boolean;
  loading: string | null;
  handleSubscribe: (planName: string, priceId: string) => Promise<void>;
}

export const ProfileSubscription = ({
  profile,
  isLoadingProfile,
  loading,
  handleSubscribe,
}: ProfileSubscriptionProps) => {
  return (
    <tr>
      <td className="py-4">
        <Label>My Subscription</Label>
      </td>
      <td className="py-4">
        {isLoadingProfile ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <SubscriptionBadge tier={profile?.membership_tier} />
            <SubscriptionPlans 
              currentTier={profile?.membership_tier || 'free'}
              onSubscribe={handleSubscribe}
              isLoading={loading}
            />
            <div className="mt-2">
              <Link 
                to="/billing" 
                className="text-sm text-green-600 hover:text-green-700"
              >
                View all plans and pricing →
              </Link>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};