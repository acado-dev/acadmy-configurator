import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { AcadoLogo } from "@/components/AcadoLogo";
import authBg from "@/assets/auth-bg.png";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes - actual auth would require Supabase integration
    if (email && password) {
      toast({
        title: "Login Successful",
        description: "Welcome back to ACADO Study Abroad Portal",
      });
      navigate("/");
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = () => {
    toast({
      title: "Google Sign-In",
      description: "Google authentication requires Supabase integration",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Auth form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-8 py-6">
          <Link to="/" className="inline-block">
            <AcadoLogo className="h-8" />
          </Link>
        </header>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-8">
          <Card className="w-full max-w-md bg-card/50 backdrop-blur border-border/50 p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
                <p className="text-muted-foreground mt-2">
                  Please enter your credentials to sign in!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background/50 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary-hover transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" variant="gradient">
                  Sign In
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account yet?{" "}
                <Link to="/signup" className="text-primary hover:text-primary-hover transition-colors font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:block lg:w-1/2 relative bg-card">
        <img
          src={authBg}
          alt="Education illustration"
          className="absolute inset-0 h-full w-full object-contain p-12"
        />
      </div>
    </div>
  );
};

export default Login;