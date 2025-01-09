import { useState } from "react";
import { TimelinePost as TimelinePostType } from "@/types/timeline";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RatingStars } from "@/components/recipes/RatingStars";
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
    if (post.recipe) {
      try {
        await navigator.share({
          title: post.recipe.title,
          text: `Check out this recipe: ${post.recipe.title}`,
          url: window.location.href
        });
      } catch (err) {
        const shareUrl = window.location.href;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    }
  };

  const handleSaveToPDF = async () => {
    if (!post.recipe) return;

    try {
      const recipeContent = document.getElementById(`recipe-content-${post.recipe.id}`);
      if (!recipeContent) return;

      toast.loading("Generating PDF...");

      const canvas = await html2canvas(recipeContent);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${post.recipe.title}.pdf`);

      toast.dismiss();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF");
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
              Share Recipe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSaveToPDF}>
              <Download className="h-4 w-4 mr-2" />
              Save as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
