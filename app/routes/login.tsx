import { useState } from "react";
import { json, redirect, type ActionFunction } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { Eye, EyeOff, Mail, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/authenticate`, {
      email,
      password,
    });
    if (response.status === 200) {
      return redirect("/dashboard");
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    return json(
      {
        error:
          error.response?.data?.message || "An error occurred during login",
      },
      { status: error.response?.status || 500 }
    );
  }
};

const handleSignup = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      email,
      password,
    });
    if (response.status === 200) {
      return redirect("/onboarding");
    }
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    return json(
      {
        error:
          error.response?.data?.message || "An error occurred during signup",
      },
      { status: error.response?.status || 500 }
    );
  }
};

const validateCredentials = (email: string | null, password: string | null) => {
  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }
  return null;
};

const validatePasswordsMatch = (
  password: string,
  confirmPassword: string | null
) => {
  if (password !== confirmPassword) {
    return json({ error: "Passwords do not match" }, { status: 400 });
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const email = formData.get("email");
  const password = formData.get("password");

  const validationError = validateCredentials(email, password);
  if (validationError) return validationError;

  if (action === "login") {
    return handleLogin(email as string, password as string);
  } else if (action === "signup") {
    const confirmPassword = formData.get("confirmPassword");
    const passwordMatchError = validatePasswordsMatch(
      password as string,
      confirmPassword
    );
    if (passwordMatchError) return passwordMatchError;

    return handleSignup(email as string, password as string);
  }
};

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const actionData = useActionData();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleAuthMode = () => setIsSignUp(!isSignUp);

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
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input id="email" name="email" type="email" required />
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              name="_action"
              value={isSignUp ? "signup" : "login"}
            >
              {isSignUp ? "Sign Up" : "Log In"}
            </Button>
          </Form>
          {actionData?.error && (
            <p className="text-sm text-red-500 mt-2">{actionData.error}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
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
