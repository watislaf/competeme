// Header.tsx
import { Link, NavLink } from "@remix-run/react";
import { AvatarSection } from "./AvatarSection";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { NavSheet } from "./NavSheet";
import { navLinks } from "./nav-links";
import { buttonVariants } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 md:py-4">
        <div className="flex items-center space-x-4">
          <NavSheet />
          <Link className="flex items-center space-x-2" to="/public">
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