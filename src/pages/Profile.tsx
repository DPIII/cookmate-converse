import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Profile = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
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
        .single();

      if (error) throw error;

      setUsername(data.username || "");
      setAvatarUrl(data.avatar_url || "");
      setContactInfo(data.contact_info || "");
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
        username,
        avatar_url: avatarUrl,
        contact_info: contactInfo,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updates);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${session?.user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto pt-20 px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-green-800 mb-6">Profile Settings</h1>
        
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-4">
                <Label>Avatar</Label>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={uploadAvatar}
                      disabled={uploading}
                      className="hidden"
                    />
                    <Button variant="outline" disabled={uploading}>
                      {uploading ? "Uploading..." : "Upload Avatar"}
                    </Button>
                  </Label>
                </div>
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
                  value={session?.user?.email || ""}
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
          </tbody>
        </table>

        <div className="mt-6">
          <Button onClick={updateProfile} className="w-full">
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;