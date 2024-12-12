import { useState } from "react";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitAction } from "@/pages/login/types";

interface AuthFormProps {
  isSignUp: boolean;
  error?: string;
  onSubmit: (data: {
      username: string;
    email: string;
    password: string;
    type: SubmitAction;
  }) => void;
}

export function AuthForm({ isSignUp, error, onSubmit }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
      <div className="space-y-4">
          <div className="space-y-2">
              {isSignUp && (
                  <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <Input
                          id="username"
                          name="username"
                          type="username"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"/>
                      </div>
                  </div>
              )}
          </div>
              <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                      <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"/>
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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={togglePasswordVisibility}
                      >
                          {showPassword ? (
                              <EyeOff className="h-4 w-4"/>
                          ) : (
                              <Eye className="h-4 w-4"/>
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
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                  </div>
              )}
              <Button
                  onClick={() =>
                      onSubmit({
                          username,
                          email,
                          password,
                          type: isSignUp ? SubmitAction.Signup : SubmitAction.Login,
                      })
                  }
                  className="w-full"
              >
                  {isSignUp ? "Sign Up" : "Log In"}
              </Button>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
          );
          }
