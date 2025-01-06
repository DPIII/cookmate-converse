import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  onClick: () => void;
}

export const ShareButton = ({ onClick }: ShareButtonProps) => {
  return (
    <Button variant="outline" onClick={onClick} className="self-start">
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
};