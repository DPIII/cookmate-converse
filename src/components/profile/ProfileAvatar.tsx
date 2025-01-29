import { Label } from "@/components/ui/label";
import { AvatarUpload } from "./AvatarUpload";

interface ProfileAvatarProps {
  avatarUrl: string;
  userId: string;
  onAvatarChange: (url: string) => void;
}

export const ProfileAvatar = ({ avatarUrl, userId, onAvatarChange }: ProfileAvatarProps) => {
  return (
    <tr>
      <td className="py-4">
        <Label>Avatar</Label>
      </td>
      <td className="py-4">
        <AvatarUpload
          avatarUrl={avatarUrl}
          userId={userId}
          onAvatarChange={onAvatarChange}
        />
      </td>
    </tr>
  );
};