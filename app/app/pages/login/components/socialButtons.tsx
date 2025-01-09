import { Github, Twitter } from "lucide-react";
import { Button } from "../../../components/ui/button";

export function SocialButtons() {
  return (
    <>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline">
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>
        <Button variant="outline">
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </Button>
      </div>
    </>
  );
}
