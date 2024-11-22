import { Link, useLocation } from "@remix-run/react";
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import {
  getTheme,
  setTheme as setSystemTheme,
} from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/styles";

export function Header() {
  const hydrated = useHydrated();
  const [, rerender] = React.useState({});
  const setTheme = React.useCallback((theme: string) => {
    setSystemTheme(theme);
    rerender({});
  }, []);
  const theme = getTheme();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "User Stats", path: "/stats" },
    { name: "Login", path: "/login" },
    { name: "Friends", path: "/friends" },
    { name: "Challenges", path: "/challenges" },
    { name: "Activity", path: "/activity" },
  ];

  return (
    <header className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 md:py-4">
        <div className="flex items-center space-x-4">
          <Link className="flex items-center space-x-2" to="/">
            <span className="text-lg font-bold">competeme</span>
          </Link>
        </div>
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-md  ",
                  location.pathname === item.path
                    ? "bg-gray-300"
                    : "bg-gray-200"
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="w-10 h-10 rounded-full border"
              size="icon"
              variant="ghost"
            >
              <span className="sr-only">Theme selector</span>
              {!hydrated ? null : theme === "dark" ? (
                <MoonIcon />
              ) : theme === "light" ? (
                <SunIcon />
              ) : (
                <LaptopIcon />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full"
                onClick={() => setTheme("light")}
                aria-selected={theme === "light"}
              >
                Light
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full"
                onClick={() => setTheme("dark")}
                aria-selected={theme === "dark"}
              >
                Dark
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full"
                onClick={() => setTheme("system")}
                aria-selected={theme === "system"}
              >
                System
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
