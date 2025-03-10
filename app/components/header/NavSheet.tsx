import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@remix-run/react";
import { Activity, BarChart3, Home, Trophy, Users } from "lucide-react";
import { useUser } from "@/hooks/user/useUser";

export const NavSheet = () => {
  const [open, setOpen] = React.useState(false);
  const closeSheet = () => setOpen(false);
  const { profile } = useUser();

  const navLinks = [
    {
      name: "Home",
      path: `/users/${profile?.id}/home`,
      icon: Home,
    },
    {
      name: "User Stats",
      path: `/users/${profile?.id}/stats`,
      icon: BarChart3,
    },
    {
      name: "Friends",
      path: `/users/${profile?.id}/friends`,
      icon: Users,
    },
    {
      name: "Challenges",
      path: `/users/${profile?.id}/challenges`,
      icon: Trophy,
    },
    {
      name: "Activity",
      path: `/users/${profile?.id}/activity`,
      icon: Activity,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          ☰
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-4 md:w-64">
        <div className="flex flex-col space-y-2 mt-4">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSheet}
                className={buttonVariants({ variant: "outline" })}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
