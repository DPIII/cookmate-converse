import { useState } from "react";
import { UserProfile } from "@/types/timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserSearchProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

export function UserSearch({ showSearch, setShowSearch }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', `%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data as UserProfile[]);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          connected_user_id: userId,
          status: 'pending'
        });

      if (error) throw error;
      toast.success('Connection request sent');
    } catch (error) {
      console.error('Error connecting with user:', error);
      toast.error('Failed to send connection request');
    }
  };

  return (
    <Dialog open={showSearch} onOpenChange={setShowSearch}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Find Friends</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span>{user.username}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleConnect(user.id)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}