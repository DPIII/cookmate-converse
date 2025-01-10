import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ChefHat } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password || !username) {
      setError("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name,
            avatar_url: avatarUrl,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Check if profile was created by the trigger
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select()
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw new Error("Error verifying account creation");
        }

        toast.success("Account created successfully!");
        // Redirect to subscription page
        navigate("/subscription");
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      setError(error.message || "Error creating account. Please try again.");
      toast.error(error.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-cream-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <ChefHat className="h-16 w-16 text-primary-700" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Create Your Account
          </h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Profile Picture (Optional)</Label>
              <AvatarUpload
                avatarUrl={avatarUrl}
                userId="temp"
                onAvatarChange={setAvatarUrl}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};