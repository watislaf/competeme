import { Link } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm } from "./components/authForm";
import { SocialButtons } from "./components/socialButtons";
import { useState } from "react";
import { SubmitAction } from "@/pages/login/types";
import { useSignUpMutation } from "@/pages/login/hooks/useSignUpMutation";
import { useLoginMutation } from "@/pages/login/hooks/useLoginMutation";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleAuthMode = () => setIsSignUp(!isSignUp);
  const { mutate: signUp, error: signUpError } = useSignUpMutation();
  const { mutate: login, error: loginError } = useLoginMutation();
  const onSubmit = ({
    email,
    password,
    type,
  }: {
    email: string;
    password: string;
    type: SubmitAction;
  }) => {
    if (type === SubmitAction.Login) {
      login({ email, password });
    }
    if (type === SubmitAction.Signup) {
      signUp({ email, password });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://picsum.photos/1080/1920')",
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? "Sign Up" : "Log In"}</CardTitle>
          <CardDescription>
            {isSignUp
              ? "Create an account to start tracking your time"
              : "Welcome back! Please log in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm
            isSignUp={isSignUp}
            onSubmit={onSubmit}
            error={signUpError || loginError}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <SocialButtons />
          <div className="text-center text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button variant="link" className="p-0" onClick={toggleAuthMode}>
              {isSignUp ? "Log In" : "Sign Up"}
            </Button>
          </div>
          <div className="text-center text-sm">
            <Link to="/demo" className="text-primary hover:underline">
              Try the demo
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
