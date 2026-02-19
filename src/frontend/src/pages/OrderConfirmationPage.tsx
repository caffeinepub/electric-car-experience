import React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/order-confirmation' }) as { orderId?: string };

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 flex items-center justify-center px-4">
      <Card className="max-w-lg bg-card border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-cyan" />
          </div>
          <CardTitle className="text-3xl text-foreground">Order Confirmed!</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your Tesla purchase has been successfully processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {search.orderId && (
            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="text-2xl font-bold text-cyan">#{search.orderId}</p>
            </div>
          )}
          <p className="text-center text-muted-foreground">
            Thank you for your purchase! You will receive a confirmation email shortly with delivery details.
          </p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button
            onClick={() => navigate({ to: '/profile' })}
            variant="outline"
            className="flex-1 border-cyan text-cyan hover:bg-cyan hover:text-black"
          >
            View Orders
          </Button>
          <Button
            onClick={() => navigate({ to: '/cars' })}
            className="flex-1 bg-cyan hover:bg-cyan/80 text-black"
          >
            Browse More Cars
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
