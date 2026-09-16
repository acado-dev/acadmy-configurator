import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AcadoLogo } from '@/components/AcadoLogo';
import { triggerCommunication, triggerSummary } from '@/lib/messaging';

interface Props {
  loginPath?: string;
}

const ForgotPassword = ({ loginPath = '/user/login' }: Props) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const result = triggerCommunication('forgot_password', {
      name: email.split('@')[0],
      email,
      reset_link: `${window.location.origin}${loginPath}?reset=1`,
    });
    setSent(true);
    toast({ title: 'Reset instructions sent', description: triggerSummary(result) });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <AcadoLogo className="mx-auto h-8" />
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter your registered email and we will send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-3 rounded-lg border bg-muted/40 p-4 text-center">
              <CheckCircle2 className="mx-auto h-6 w-6 text-primary" />
              <p className="text-sm">
                We have sent reset instructions to <strong>{email}</strong>. Check your
                email, SMS and your ACADO inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Link to={loginPath} className="text-sm text-primary hover:underline">
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
