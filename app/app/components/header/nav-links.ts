// nav-links.ts
import { Activity, BarChart3, Home, Trophy, Users } from "lucide-react";

export const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "User Stats", path: "/stats", icon: BarChart3 },
  { name: "Friends", path: "/friends", icon: Users },
  { name: "Challenges", path: "/challenges", icon: Trophy },
  { name: "Activity", path: "/activity", icon: Activity },
];
