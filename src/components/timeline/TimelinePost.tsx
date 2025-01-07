import { useState } from "react";
import { TimelinePost as TimelinePostType } from "@/types/timeline";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TimelinePost({ post }: { post: TimelinePostType }) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLike = async () => {
    if (!session?.user) {
      toast.error("Please sign in to like recipes");
      return;
    }

    try {
      if (!isLiked) {
        const { error } = await supabase
          .from('recipe_likes')
          .insert({
            recipe_id: post.recipe.id,
            user_id: session.user.id
          });

        if (error) throw error;
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        toast.success("Recipe liked!");
      } else {
        const { error } = await supabase
          .from('recipe_likes')
          .delete()
          .match({ 
            recipe_id: post.recipe.id,
            user_id: session.user.id 
          });

        if (error) throw error;
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Failed to update like");
    }
  };

  const handleComment = () => {
    if (post.recipe) {
      navigate(`/recipes/${post.recipe.id}?openComments=true`);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <div className="bg-green-100 h-full w-full flex items-center justify-center text-green-800 font-semibold">
              {post.user.username?.[0]?.toUpperCase() || '?'}
            </div>
          </Avatar>
          <div>
            <h3 className="font-semibold text-green-800">{post.user.username}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-gray-600">{post.content}</p>
        
        {post.recipe && (
          <>
            <div 
              className="bg-green-50 rounded-lg p-4 cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => setIsDialogOpen(true)}
            >
              <h4 className="text-lg font-medium text-green-800 mb-2">
                {post.recipe.title}
              </h4>
              {post.recipe.image_url && (
                <img
                  src={post.recipe.image_url}
                  alt={post.recipe.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
              )}
              <p className="text-gray-600 line-clamp-2">{post.recipe.content}</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-green-800">
                    {post.recipe.title}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[calc(90vh-8rem)]">
                  <div className="space-y-6 p-4">
                    {post.recipe.image_url && (
                      <img
                        src={post.recipe.image_url}
                        alt={post.recipe.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex items-center gap-4">
                      {post.recipe.cuisine_type && (
                        <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {post.recipe.cuisine_type}
                        </span>
                      )}
                      {post.recipe.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{post.recipe.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="prose prose-green max-w-none">
                      <div className="whitespace-pre-wrap">{post.recipe.content}</div>
                    </div>

                    {post.recipe.notes && (
                      <div className="bg-gray-50 rounded-lg p-4 mt-6">
                        <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                        <p className="text-gray-600">{post.recipe.notes}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4 pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-gray-600 ${isLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
          Like {likeCount > 0 && `(${likeCount})`}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-600"
          onClick={handleComment}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-600">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </Card>
  );
}