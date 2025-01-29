import { useState } from "react";
import { TimelinePost as TimelinePostType } from "@/types/timeline";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Copy, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RatingStars } from "@/components/recipes/RatingStars";
import { ShoppingListDialog } from "@/components/chat/actions/ShoppingListDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TimelinePost({ post }: { post: TimelinePostType }) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempRating, setTempRating] = useState<number | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);

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

  const handleShare = async () => {
    if (!post.recipe?.share_id) {
      toast.error("Share ID not available for this recipe");
      return;
    }

    try {
      const shareUrl = `${window.location.origin}/recipes/shared/${post.recipe.share_id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Recipe link copied to clipboard!");
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      toast.error("Failed to copy link");
    }
  };

  const handleCopyText = async () => {
    if (!post.recipe) return;

    try {
      const recipeText = `
Recipe: ${post.recipe.title}

${post.recipe.content}

${post.recipe.notes ? `Notes: ${post.recipe.notes}` : ''}

Cuisine: ${post.recipe.cuisine_type || 'Not specified'}
Rating: ${post.recipe.rating ? `${post.recipe.rating}/5` : 'Not rated'}
`.trim();

      await navigator.clipboard.writeText(recipeText);
      toast.success("Recipe text copied to clipboard!");
    } catch (error) {
      console.error('Error copying recipe text:', error);
      toast.error("Failed to copy recipe text");
    }
  };

  const handleRating = (rating: number) => {
    setTempRating(rating);
  };

  const handleSaveRating = async () => {
    if (!tempRating || !post.recipe) return;
    
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .update({ rating: tempRating })
        .eq('id', post.recipe.id);

      if (error) throw error;

      toast.success("Rating saved successfully!");
      post.recipe.rating = tempRating;
      setTempRating(null);
    } catch (error) {
      console.error('Error saving rating:', error);
      toast.error("Failed to save rating");
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
              {post.recipe.shopping_list && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShoppingList(true);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  See Shopping List
                </Button>
              )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-green-800">
                    {post.recipe.title}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[calc(90vh-8rem)]">
                  <div id={`recipe-content-${post.recipe.id}`} className="space-y-6 p-4">
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
                      <RatingStars
                        rating={post.recipe.rating ?? null}
                        tempRating={tempRating}
                        onRatingChange={handleRating}
                        onSaveRating={handleSaveRating}
                      />
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

            <ShoppingListDialog
              open={showShoppingList}
              onOpenChange={setShowShoppingList}
              generatingList={false}
              shoppingList={post.recipe.shopping_list}
            />
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyText}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
