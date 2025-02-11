import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileFields } from "./ProfileFields";
import { ProfileSubscription } from "./ProfileSubscription";
import { ProfileNavigation } from "./ProfileNavigation";

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
  const [loading, setLoading] = useState<string | null>(null);

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

  const handleSubscribe = async (planName: string, priceId: string) => {
    try {
      setLoading(planName);
      
      if (!priceId) {
        toast.error("Invalid plan selected");
        return;
      }

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
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container max-w-4xl mx-auto px-4 py-8 pt-24">
        <ProfileHeader />

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-green-800 mb-6">Profile Settings</h1>
          
          <table className="w-full">
            <tbody>
              <ProfileAvatar
                avatarUrl={avatarUrl}
                userId={userId}
                onAvatarChange={setAvatarUrl}
              />
              <ProfileFields
                username={username}
                setUsername={setUsername}
                email={email}
                contactInfo={contactInfo}
                setContactInfo={setContactInfo}
              />
              <ProfileSubscription
                profile={profile}
                isLoadingProfile={isLoadingProfile}
                loading={loading}
                handleSubscribe={handleSubscribe}
              />
            </tbody>
          </table>

          <div className="mt-6">
            <Button onClick={onSubmit} className="w-full">
              Update Profile
            </Button>
          </div>
        </div>

        <ProfileNavigation />
      </div>
    </div>
  );
};