import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-emerald-100">
        <CardHeader className="space-y-3">
          <div className="mx-auto mb-2">
            <img 
              src="https://res.cloudinary.com/dql8xbmqj/image/upload/v1768241905/logo-dark_oxfhsb.jpg" 
              alt="Sthiroot Logo" 
              className="h-12 mx-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {submitted ? 'Check Your Email' : 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-center">
            {submitted 
              ? 'We have sent a password reset link to your email' 
              : 'Enter your email address to receive a password reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-emerald-600" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  If an account exists for <strong>{email}</strong>, you will receive a password reset email shortly.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your spam folder if you don't see it.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Send Reset Link
              </Button>
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => navigate('/')} 
                className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}