import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileForm } from "@/components/profile/ProfileForm";

const Profile = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      if (!session?.user) throw new Error("No user");

      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, contact_info")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUsername(data.username || "");
        setAvatarUrl(data.avatar_url || "");
        setContactInfo(data.contact_info || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      if (!session?.user) throw new Error("No user");

      const updates = {
        id: session.user.id,
        username: username.trim(),
        avatar_url: avatarUrl,
        contact_info: contactInfo.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updates, {
          onConflict: 'id'
        });

      if (error) throw error;
      
      await getProfile(); // Refresh profile data after update
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto pt-20 px-4">
      <ProfileForm
        username={username}
        setUsername={setUsername}
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
        contactInfo={contactInfo}
        setContactInfo={setContactInfo}
        email={session?.user?.email || ""}
        userId={session?.user?.id || ""}
        onSubmit={updateProfile}
      />
    </div>
  );
};

export default Profile;