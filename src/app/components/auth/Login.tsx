import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    
    // Route based on email (this maps to user role in AuthContext)
    if (email === 'partner@sthiroot.com' || email === 'rajesh@sthiroot.com' || email === 'priya@sthiroot.com' || email === 'agent@sthiroot.com') {
      navigate('/partner/dashboard');
    } else if (email === 'store@sthiroot.com' || email === 'mumbai@sthiroot.com' || email === 'delhi@sthiroot.com') {
      navigate('/store/dashboard');
    } else if (email === 'employee@sthiroot.com' || email === 'amit@sthiroot.com' || email === 'sneha@sthiroot.com') {
      navigate('/employee/dashboard');
    } else if (email === 'accountant@sthiroot.com') {
      navigate('/accountant/wallet');
    } else if (email === 'kyc@sthiroot.com') {
      navigate('/kyc-reviewer/verification');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-emerald-100">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto mb-4">
            <img 
              src="https://res.cloudinary.com/dql8xbmqj/image/upload/v1768241905/logo-dark_oxfhsb.jpg" 
              alt="Sthiroot Logo" 
              className="h-16 mx-auto object-contain"
            />
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Welcome to Sthiroot</CardTitle>
          <CardDescription className="text-base">Reset from the root, stay sthira forever</CardDescription>
        </CardHeader>
        <CardContent>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
            >
              Sign In
            </Button>
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-xs text-emerald-800 mb-2 font-semibold">Demo Credentials:</p>
              <p className="text-xs text-emerald-600">Owner: owner@sthiroot.com</p>
              <p className="text-xs text-emerald-600">KYC Reviewer: kyc@sthiroot.com</p>
              <p className="text-xs text-emerald-600">Accountant: accountant@sthiroot.com</p>
              <p className="text-xs text-emerald-600">Employee: employee@sthiroot.com</p>
              <p className="text-xs text-emerald-600">Store: store@sthiroot.com</p>
              <p className="text-xs text-emerald-600">Partner: partner@sthiroot.com</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Password: (any)</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}