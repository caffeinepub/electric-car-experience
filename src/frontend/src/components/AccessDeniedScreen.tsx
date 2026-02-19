import React from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { ShieldX } from 'lucide-react';

export default function AccessDeniedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <ShieldX className="w-24 h-24 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Access Denied</h1>
        <p className="text-lg text-muted-foreground">
          You don't have permission to access this page. Admin privileges are required.
        </p>
        <Link to="/cars">
          <Button className="bg-cyan hover:bg-cyan/80 text-black">
            Go to Cars
          </Button>
        </Link>
      </div>
    </div>
  );
}
