import { Link, NavLink } from "@remix-run/react";
import { AvatarSection } from "./AvatarSection";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { NavSheet } from "./NavSheet";
import { Activity, BarChart3, Home, Trophy, Users } from "lucide-react";
import { useUser } from "@/hooks/user/useUser";
import { buttonVariants } from "../ui/button";

export const Header = () => {
  const { profile } = useUser();

  if (!profile) {
    return (
      <header className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 md:py-4">
          <div className="flex items-center space-x-4">
            <NavSheet />
            <Link className="flex items-center space-x-2" to="/">
              <span className="text-lg font-bold">competeme</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcher />
          </div>
          <div className="flex md:hidden">
            <ThemeSwitcher />
          </div>
          <AvatarSection />
        </div>
      </header>
    );
  }

  const navLinks = [
    {
      name: "Home",
      path: `/users/${profile.id}/home`,
      icon: Home,
    },
    {
      name: "User Stats",
      path: `/users/${profile.id}/stats`,
      icon: BarChart3,
    },
    {
      name: "Friends",
      path: `/users/${profile.id}/friends`,
      icon: Users,
    },
    {
      name: "Challenges",
      path: `/users/${profile.id}/challenges`,
      icon: Trophy,
    },
    {
      name: "Activity",
      path: `/users/${profile.id}/activity`,
      icon: Activity,
    },
  ];

  return (
    <header className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 md:py-4">
        <div className="flex items-center space-x-4">
          <NavSheet />
          <Link className="flex items-center space-x-2" to="/">
            <span className="text-lg font-bold">competeme</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={buttonVariants({ variant: "outline" })}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
          <ThemeSwitcher />
        </div>
        <div className="flex md:hidden">
          <ThemeSwitcher />
        </div>
        <AvatarSection />
      </div>
    </header>
  );
};
