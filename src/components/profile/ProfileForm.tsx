import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "./AvatarUpload";

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