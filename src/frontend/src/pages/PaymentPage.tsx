import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetInventory } from '../hooks/useQueries';
import { useCreateOrder } from '../hooks/useMutations';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function PaymentPage() {
  const { vin } = useParams({ from: '/payment/$vin' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: inventory, isLoading } = useGetInventory();
  const createOrder = useCreateOrder();

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const car = inventory?.find((c) => c.vinNumber === vin);

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Authentication Required</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please log in to purchase a vehicle
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => navigate({ to: '/login' })}
              className="w-full bg-cyan hover:bg-cyan/80 text-black"
            >
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-cyan" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Car Not Found</CardTitle>
            <CardDescription className="text-muted-foreground">
              The selected vehicle is not available
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => navigate({ to: '/cars' })}
              className="w-full bg-cyan hover:bg-cyan/80 text-black"
            >
              Back to Cars
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all payment details');
      return;
    }

    try {
      const orderId = await createOrder.mutateAsync(vin);
      navigate({ to: '/order-confirmation', search: { orderId: orderId.toString() } });
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{car.model}</h3>
                <p className="text-muted-foreground">{car.year} Model</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VIN:</span>
                  <span className="font-mono text-sm text-foreground">{car.vinNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Battery:</span>
                  <span className="text-foreground">{car.batteryCapacity.toString()} kWh</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-foreground">Total:</span>
                  <span className="text-3xl font-bold text-cyan">${car.price.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Payment Details</CardTitle>
              <CardDescription className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="w-4 h-4" />
                Secure payment processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <img
                  src="/assets/generated/payment-security.dim_200x200.png"
                  alt="Secure Payment"
                  className="w-24 h-24"
                />
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-foreground">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-foreground">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      maxLength={5}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-foreground">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  disabled={createOrder.isPending}
                  className="w-full bg-cyan hover:bg-cyan/80 text-black"
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${car.price.toLocaleString()}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
