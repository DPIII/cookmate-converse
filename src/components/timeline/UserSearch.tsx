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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserSearchProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

export function UserSearch({ showSearch, setShowSearch }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [open, setOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      const { data: usernameResults, error: usernameError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, created_at')
        .or(`username.ilike.%${query}%,id.eq.${query}`)
        .limit(10);

      if (usernameError) throw usernameError;
      
      // If query looks like an email, also search in auth.users
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(query)) {
        const { data: emailResults, error: emailError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, created_at')
          .eq('id', query)
          .limit(1);

        if (emailError) throw emailError;
        
        if (emailResults && emailResults.length > 0) {
          setSearchResults([...usernameResults, ...emailResults]);
        } else {
          setSearchResults(usernameResults);
        }
      } else {
        setSearchResults(usernameResults);
      }
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to connect with users');
        return;
      }

      // Check if connection already exists
      const { data: existingConnection } = await supabase
        .from('user_connections')
        .select()
        .eq('user_id', user.id)
        .eq('connected_user_id', userId)
        .single();

      if (existingConnection) {
        toast.error('Connection already exists');
        return;
      }

      const { error } = await supabase
        .from('user_connections')
        .insert({
          user_id: user.id,
          connected_user_id: userId,
          status: 'pending'
        });

      if (error) throw error;
      toast.success('Connection request sent');
      setOpen(false);
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
          <DialogDescription>
            Search for users by username or email and connect with them.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by username or email"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                {hasSearched && searchResults.length === 0 ? (
                  <div className="p-4">
                    <Alert variant="default" className="bg-muted">
                      <AlertDescription className="text-sm text-muted-foreground">
                        No users found matching "{searchQuery}"
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <>
                    <CommandEmpty>Start typing to search users...</CommandEmpty>
                    <CommandGroup>
                      {searchResults.map((user) => (
                        <CommandItem
                          key={user.id}
                          className="flex items-center justify-between p-2"
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
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </DialogContent>
    </Dialog>
  );
}