'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AppContext';

const MOCK_OTP = '123456';

export default function VerifyPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { verify, userEmail } = useAuth();

  useEffect(() => {
    if (!userEmail) {
      router.replace('/');
    }
  }, [userEmail, router]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === MOCK_OTP) {
      verify();
      router.push('/products');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-headline">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a one-time password to <span className="font-medium text-foreground">{userEmail}</span>.
            (Hint: it's 123456)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">One-Time Password</Label>
              <Input
                id="otp"
                type="text"
                placeholder="6-digit code"
                required
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                }}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Verify and Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
