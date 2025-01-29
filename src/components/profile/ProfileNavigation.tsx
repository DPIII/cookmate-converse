import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const ProfileNavigation = () => {
  return (
    <div className="mt-8 flex justify-center gap-4">
      <Button variant="outline" asChild>
        <Link to="/recipes">My Recipes</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/timeline">Timeline</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/chat">Recipe Generator</Link>
      </Button>
    </div>
  );
};