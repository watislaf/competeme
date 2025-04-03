// AvatarSection.tsx
import { Link, useLocation } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@/hooks/user/useUser";

export const AvatarSection = () => {
  const location = useLocation();
  const { profile } = useUser();
  const queryClient = useQueryClient();
  const logout = () => {
    localStorage.removeItem("ACCESS_TOKEN_KEY");
    localStorage.removeItem("REFRESH_TOKEN_KEY");
    queryClient.refetchQueries({ queryKey: ["profile"] });
  };
  return (
    <div className="flex flex-row items-center space-x-4">
      {profile ? (
        <>
          <Link
            to={`/users/${profile.id}/profile`}
            className={buttonVariants({ variant: "outline" })}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile.imageUrl} alt={profile.name} />
              <AvatarFallback>
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link
            to="/login"
            onClick={logout}
            className={buttonVariants({ variant: "outline" })}
          >
            Logout
          </Link>
        </>
      ) : (
        location.pathname !== "/login" && (
          <Link to="/login" className={buttonVariants({ variant: "outline" })}>
            Login
          </Link>
        )
      )}
    </div>
  );
};
