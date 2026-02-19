import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetInventory } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const carImages: Record<string, string> = {
  'Model S': '/assets/generated/model-s.dim_800x600.png',
  'Model 3': '/assets/generated/model-3.dim_800x600.png',
  'Model X': '/assets/generated/model-x.dim_800x600.png',
  'Model Y': '/assets/generated/model-y.dim_800x600.png',
};

export default function CarsPage() {
  const navigate = useNavigate();
  const { data: inventory, isLoading } = useGetInventory();
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [inventory]);

  const handleBuyNow = (vin: string) => {
    navigate({ to: '/payment/$vin', params: { vin } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">Tesla Models</h1>
          <p className="text-xl text-muted-foreground">
            Discover our revolutionary electric vehicles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {inventory?.map((car, index) => (
            <div
              key={car.vinNumber}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              data-index={index}
              className={`transition-all duration-1000 ${
                visibleCards.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              <Card className="bg-card border-border overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={carImages[car.model] || '/assets/generated/model-s.dim_800x600.png'}
                    alt={car.model}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {!car.isForSale && (
                    <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                      Sold Out
                    </Badge>
                  )}
                  {car.isForSale && (
                    <Badge className="absolute top-4 right-4 bg-cyan text-black">
                      Available
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">{car.model}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {car.year} Model
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Battery Capacity:</span>
                    <span className="font-semibold text-foreground">{car.batteryCapacity.toString()} kWh</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">VIN:</span>
                    <span className="font-mono text-sm text-foreground">{car.vinNumber}</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="text-3xl font-bold text-cyan">
                      ${car.price.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleBuyNow(car.vinNumber)}
                    disabled={!car.isForSale}
                    className="w-full bg-cyan hover:bg-cyan/80 text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {car.isForSale ? 'Buy Now' : 'Sold Out'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
