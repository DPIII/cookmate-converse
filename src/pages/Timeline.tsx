import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TimelinePost {
  id: string;
  content: string;
  created_at: string;
  recipe: {
    title: string;
    content: string;
    image_url: string | null;
  };
  user: {
    username: string;
  };
}

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  phone_number?: string;
}

export default function Timeline() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<TimelinePost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimelinePosts();
  }, [session]);

  const fetchTimelinePosts = async () => {
    try {
      const { data: timelinePosts, error } = await supabase
        .from('timeline_posts')
        .select(`
          id,
          content,
          created_at,
          recipe:recipe_id (
            title,
            content,
            image_url
          ),
          user:user_id (
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(timelinePosts as TimelinePost[]);
    } catch (error) {
      console.error('Error fetching timeline posts:', error);
      toast.error('Failed to load timeline posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, phone_number')
        .or(`username.ilike.%${searchQuery}%,phone_number.ilike.%${searchQuery}%`)
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
          user_id: session?.user.id,
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
    <div className="min-h-screen bg-green-50/30">
      <Navigation />
      <main className="max-w-4xl mx-auto pt-20 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">Timeline</h1>
          <Button
            variant="outline"
            onClick={() => setShowSearch(true)}
            className="text-green-600"
          >
            <Search className="h-4 w-4 mr-2" />
            Find Friends
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No posts yet. Connect with friends to see their recipes!
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-green-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-green-800">
                      {post.user.username}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <h4 className="text-lg font-medium mb-2">{post.recipe.title}</h4>
                {post.recipe.image_url && (
                  <img
                    src={post.recipe.image_url}
                    alt={post.recipe.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <p className="text-gray-700">{post.content}</p>
              </div>
            ))}
          </div>
        )}

        <Dialog open={showSearch} onOpenChange={setShowSearch}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Find Friends</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by username or phone number"
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
      </main>
    </div>
  );
}