import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const UniversityLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication - replace with actual auth
    if (email === 'admin@harvard.edu' && password === 'admin123') {
      // Set authentication status
      localStorage.setItem('universityAuth', 'true');
      localStorage.setItem('universityAdmin', JSON.stringify({
        id: 'uni-admin-1',
        universityId: 'harvard',
        email,
        name: 'Harvard Admin',
        role: 'admin'
      }));
      
      toast({
        title: "Login successful",
        description: "Welcome to University Admin Dashboard",
      });
      
      // Navigate to university dashboard
      setTimeout(() => {
        navigate('/university');
      }, 100);
    } else {
      setError('Invalid credentials. Use admin@harvard.edu / admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">University Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the university admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              Demo: admin@harvard.edu / admin123
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UniversityLogin;