import { Button } from "@/components/ui/button";
import { Link } from "@remix-run/react";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function LandingPageHeader() {
  return (
    <header className="container flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">competeme</span>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
        <Button asChild size="sm">
          <Link to="/login">Sign In Now</Link>
        </Button>
      </div>
    </header>
  );
}
