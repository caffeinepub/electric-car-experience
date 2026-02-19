import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetMyOrders, useGetInventory } from '../hooks/useQueries';
import LoginButton from '../components/LoginButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: orders, isLoading: ordersLoading } = useGetMyOrders();
  const { data: inventory } = useGetInventory();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Authentication Required</CardTitle>
            <CardDescription className="text-muted-foreground">
              Please log in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-cyan" />
      </div>
    );
  }

  const getCarModel = (vin: string) => {
    return inventory?.find((car) => car.vinNumber === vin)?.model || 'Unknown Model';
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-16">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/assets/generated/user-avatar.dim_150x150.png" />
                <AvatarFallback className="bg-cyan text-black text-2xl">
                  {userProfile?.id ? 'U' : '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-3xl text-foreground mb-2">My Profile</CardTitle>
                <CardDescription className="text-muted-foreground font-mono text-sm">
                  {identity.getPrincipal().toString().slice(0, 20)}...
                </CardDescription>
              </div>
              <LoginButton />
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Order History</CardTitle>
            <CardDescription className="text-muted-foreground">
              View your Tesla purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-cyan" />
              </div>
            ) : orders && orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Order ID</TableHead>
                    <TableHead className="text-foreground">Model</TableHead>
                    <TableHead className="text-foreground">VIN</TableHead>
                    <TableHead className="text-foreground">Price</TableHead>
                    <TableHead className="text-foreground">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.orderId.toString()}>
                      <TableCell className="font-semibold text-foreground">
                        #{order.orderId.toString()}
                      </TableCell>
                      <TableCell className="text-foreground">{getCarModel(order.carVin)}</TableCell>
                      <TableCell className="font-mono text-xs text-foreground">{order.carVin}</TableCell>
                      <TableCell className="text-cyan font-semibold">
                        ${order.purchasePrice.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {new Date(Number(order.timestamp) / 1000000).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <button
                  onClick={() => navigate({ to: '/cars' })}
                  className="text-cyan hover:underline"
                >
                  Browse Tesla Models
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
