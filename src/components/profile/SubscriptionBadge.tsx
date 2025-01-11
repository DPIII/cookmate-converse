import { Badge } from "@/components/ui/badge";

interface SubscriptionBadgeProps {
  tier: string;
}

export const SubscriptionBadge = ({ tier }: SubscriptionBadgeProps) => {
  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'premium':
        return 'bg-purple-500';
      case 'community':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Badge className={getTierBadgeColor(tier)}>
      {tier?.toUpperCase() || 'FREE'} PLAN
    </Badge>
  );
};