import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { TimelinePost as TimelinePostType } from "@/types/timeline";
import { TimelinePost } from "@/components/timeline/TimelinePost";
import { UserSearch } from "@/components/timeline/UserSearch";

export default function Timeline() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<TimelinePostType[]>([]);
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
          recipe:saved_recipes!timeline_posts_recipe_id_fkey (
            title,
            content,
            image_url
          ),
          user:profiles!timeline_posts_user_id_fkey (
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(timelinePosts as TimelinePostType[]);
    } catch (error) {
      console.error('Error fetching timeline posts:', error);
      toast.error('Failed to load timeline posts');
    } finally {
      setLoading(false);
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
            Coming soon
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <TimelinePost key={post.id} post={post} />
            ))}
          </div>
        )}

        <UserSearch showSearch={showSearch} setShowSearch={setShowSearch} />
      </main>
    </div>
  );
}