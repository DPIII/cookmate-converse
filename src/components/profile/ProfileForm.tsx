import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "./AvatarUpload";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileFormProps {
  username: string;
  setUsername: (value: string) => void;
  avatarUrl: string;
  setAvatarUrl: (value: string) => void;
  contactInfo: string;
  setContactInfo: (value: string) => void;
  email: string;
  userId: string;
  onSubmit: () => void;
}

export const ProfileForm = ({
  username,
  setUsername,
  avatarUrl,
  setAvatarUrl,
  contactInfo,
  setContactInfo,
  email,
  userId,
  onSubmit,
}: ProfileFormProps) => {
  // Fetch current subscription status
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('membership_tier')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch available plans
  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['billing_plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('billing_plans')
        .select('*')
        .eq('is_active', true)
        .order('price');
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubscribe = async (priceId: string) => {
    try {
      if (!priceId) {
        toast.error("Invalid plan selected");
        return;
      }

      console.log('Starting checkout with price ID:', priceId);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
      });

      if (error) {
        console.error('Checkout error:', error);
        toast.error("Failed to start checkout process");
        return;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to get checkout URL");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred while processing your request");
    }
  };

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
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Profile Settings</h1>
      
      <table className="w-full">
        <tbody>
          <tr>
            <td className="py-4">
              <Label>Avatar</Label>
            </td>
            <td className="py-4">
              <AvatarUpload
                avatarUrl={avatarUrl}
                userId={userId}
                onAvatarChange={setAvatarUrl}
              />
            </td>
          </tr>

          <tr>
            <td className="py-4">
              <Label htmlFor="username">Username</Label>
            </td>
            <td className="py-4">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </td>
          </tr>

          <tr>
            <td className="py-4">
              <Label>Email</Label>
            </td>
            <td className="py-4">
              <Input
                type="email"
                value={email}
                disabled
                className="bg-gray-50"
              />
            </td>
          </tr>

          <tr>
            <td className="py-4">
              <Label htmlFor="contact">Contact Info</Label>
            </td>
            <td className="py-4">
              <Input
                id="contact"
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Enter your contact information"
              />
            </td>
          </tr>

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
                  <Badge className={getTierBadgeColor(profile?.membership_tier)}>
                    {profile?.membership_tier?.toUpperCase() || 'FREE'} PLAN
                  </Badge>
                  
                  {isLoadingPlans ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading plans...</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {plans?.map((plan) => (
                        plan.stripe_price_id && profile?.membership_tier !== plan.name && (
                          <Button
                            key={plan.id}
                            onClick={() => handleSubscribe(plan.stripe_price_id)}
                            variant="outline"
                            size="sm"
                          >
                            {profile?.membership_tier === 'free' ? 'Upgrade to' : 'Switch to'} {plan.name}
                          </Button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6">
        <Button onClick={onSubmit} className="w-full">
          Update Profile
        </Button>
      </div>
    </div>
  );
};