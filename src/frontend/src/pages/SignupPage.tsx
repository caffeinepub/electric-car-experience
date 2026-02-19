import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ProfileSetupModal from '../components/ProfileSetupModal';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && isFetched) {
      if (userProfile === null) {
        setShowProfileSetup(true);
      } else {
        navigate({ to: '/cars' });
      }
    }
  }, [isAuthenticated, userProfile, isFetched, navigate]);

  const handleSignup = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Signup error:', error);
    }
  };

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
    navigate({ to: '/cars' });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-cyan" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background pt-32 pb-16 flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-foreground">Join Tesla</CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your account to start your electric journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Sign up using Internet Identity for secure, decentralized authentication
              </p>
              <div className="bg-muted/20 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold text-foreground">Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 text-left">
                  <li>✓ Browse and purchase Tesla vehicles</li>
                  <li>✓ Track your orders</li>
                  <li>✓ Secure blockchain-based authentication</li>
                  <li>✓ No passwords required</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              onClick={handleSignup}
              disabled={loginStatus === 'logging-in'}
              className="w-full bg-cyan hover:bg-cyan/80 text-black"
            >
              {loginStatus === 'logging-in' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing up...
                </>
              ) : (
                'Sign Up with Internet Identity'
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigate({ to: '/login' })}
                className="text-cyan hover:underline"
              >
                Log in
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
      <ProfileSetupModal open={showProfileSetup} onComplete={handleProfileComplete} />
    </>
  );
}
