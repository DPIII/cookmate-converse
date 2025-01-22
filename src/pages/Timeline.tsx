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
import { Toggle } from "@/components/ui/toggle";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PageSize = 10 | 20 | 'max';

export default function Timeline() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<TimelinePostType[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);

  useEffect(() => {
    if (session?.user) {
      fetchTimelinePosts();
    }
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
            id,
            title,
            content,
            image_url,
            cuisine_type,
            cooking_time
          ),
          user:profiles!timeline_posts_user_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPosts(timelinePosts as TimelinePostType[]);
    } catch (error) {
      console.error('Error fetching timeline posts:', error);
      toast.error('Failed to load timeline posts');
    } finally {
      setLoading(false);
    }
  };

  const itemsPerPage = pageSize === 'max' ? posts.length : pageSize;
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when changing page size
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  if (!session) {
    return (
      <div className="min-h-screen bg-green-50/30">
        <Navigation />
        <main className="max-w-4xl mx-auto pt-20 px-4">
          <div className="text-center py-8 text-gray-500">
            Please log in to view the timeline
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50/30">
      <Navigation />
      <main className="max-w-4xl mx-auto pt-20 px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-green-800">Recipe Feed</h1>
            <div className="flex items-center gap-2 border rounded-lg p-1 bg-white">
              <Toggle
                pressed={pageSize === 10}
                onPressedChange={() => setPageSize(10)}
                className="px-2.5 data-[state=on]:bg-green-50"
              >
                10
              </Toggle>
              <Toggle
                pressed={pageSize === 20}
                onPressedChange={() => setPageSize(20)}
                className="px-2.5 data-[state=on]:bg-green-50"
              >
                20
              </Toggle>
              <Toggle
                pressed={pageSize === 'max'}
                onPressedChange={() => setPageSize('max')}
                className="px-2.5 data-[state=on]:bg-green-50"
              >
                All
              </Toggle>
            </div>
          </div>
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
        ) : paginatedPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recipes shared yet. Connect with friends or save some recipes to see their activity here!
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedPosts.map((post) => (
                <TimelinePost key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}

        <UserSearch showSearch={showSearch} setShowSearch={setShowSearch} />
      </main>
    </div>
  );
}