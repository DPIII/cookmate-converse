import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFieldsProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  contactInfo: string;
  setContactInfo: (value: string) => void;
}

export const ProfileFields = ({
  username,
  setUsername,
  email,
  contactInfo,
  setContactInfo,
}: ProfileFieldsProps) => {
  return (
    <>
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
    </>
  );
};