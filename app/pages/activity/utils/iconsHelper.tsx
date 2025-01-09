import {
  Beer,
  BookOpenText,
  BriefcaseBusiness,
  Brush,
  Calendar,
  Camera,
  CarFront,
  ChefHat,
  Cigarette,
  Clapperboard,
  Clock,
  Code,
  Coffee,
  Dumbbell,
  Gamepad2,
  Heart,
  Music,
  PartyPopper,
  Pen,
  Phone,
  Pizza,
  Plane,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "BEER":
      return <Beer className="h-5 w-5" />;
    case "BOOK":
      return <BookOpenText className="h-5 w-5" />;
    case "BRIEFCASE":
      return <BriefcaseBusiness className="h-5 w-5" />;
    case "BRUSH":
      return <Brush className="h-5 w-5" />;
    case "CALENDAR":
      return <Calendar className="h-5 w-5" />;
    case "CAMERA":
      return <Camera className="h-5 w-5" />;
    case "CAR":
      return <CarFront className="h-5 w-5" />;
    case "CHEF_HAT":
      return <ChefHat className="h-5 w-5" />;
    case "CIGARETTE":
      return <Cigarette className="h-5 w-5" />;
    case "CLAPPERBOARD":
      return <Clapperboard className="h-5 w-5" />;
    case "CLOCK":
      return <Clock className="h-5 w-5" />;
    case "CODE":
      return <Code className="h-5 w-5" />;
    case "COFFEE":
      return <Coffee className="h-5 w-5" />;
    case "DUMBBELL":
      return <Dumbbell className="h-5 w-5" />;
    case "GAMEPAD":
      return <Gamepad2 className="h-5 w-5" />;
    case "HEART":
      return <Heart className="h-5 w-5" />;
    case "MUSIC":
      return <Music className="h-5 w-5" />;
    case "PARTY":
      return <PartyPopper className="h-5 w-5" />;
    case "PEN":
      return <Pen className="h-5 w-5" />;
    case "PHONE":
      return <Phone className="h-5 w-5" />;
    case "PIZZA":
      return <Pizza className="h-5 w-5" />;
    case "PLANE":
      return <Plane className="h-5 w-5" />;
    case "SHOPPING":
      return <ShoppingBag className="h-5 w-5" />;
    case "STAR":
      return <Star className="h-5 w-5" />;
    case "USERS":
      return <Users className="h-5 w-5" />;
    default:
      return <Clock className="h-5 w-5" />;
  }
};
