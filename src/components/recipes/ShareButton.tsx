import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

interface ShareButtonProps {
  onClick: () => void;
  shareUrl?: string;
}

export const ShareButton = ({ onClick, shareUrl }: ShareButtonProps) => {
  const handleCopy = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleShareToX = () => {
    if (!shareUrl) return;
    
    const text = "Check out this recipe!";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="self-start">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={handleCopy}>
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareToX}>
          Share to X
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};