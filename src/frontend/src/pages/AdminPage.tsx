import React from 'react';
import { useGetAllInquiries, useGetAllOrders, useGetInventory, useIsCallerAdmin } from '../hooks/useQueries';
import { useSetAvailability } from '../hooks/useMutations';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: inquiries, isLoading: inquiriesLoading } = useGetAllInquiries();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();
  const { data: inventory, isLoading: inventoryLoading } = useGetInventory();
  const setAvailability = useSetAvailability();

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-cyan" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleAvailabilityToggle = async (vin: string, currentStatus: boolean) => {
    try {
      await setAvailability.mutateAsync({ vin, isForSale: !currentStatus });
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-8">
          <img
            src="/assets/generated/admin-dashboard.dim_200x200.png"
            alt="Admin Dashboard"
            className="w-16 h-16"
          />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage customers, orders, and inventory</p>
          </div>
        </div>

        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="inquiries">Customer Inquiries</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Customer Inquiries</CardTitle>
                <CardDescription className="text-muted-foreground">
                  View and manage customer support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan" />
                  </div>
                ) : inquiries && inquiries.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-foreground">User</TableHead>
                        <TableHead className="text-foreground">Car VIN</TableHead>
                        <TableHead className="text-foreground">Message</TableHead>
                        <TableHead className="text-foreground">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inquiry, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs text-foreground">
                            {inquiry.userId.toString().slice(0, 10)}...
                          </TableCell>
                          <TableCell className="text-foreground">{inquiry.carVin}</TableCell>
                          <TableCell className="text-foreground">{inquiry.message}</TableCell>
                          <TableCell className="text-foreground">
                            {new Date(Number(inquiry.timestamp) / 1000000).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No inquiries yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Order Management</CardTitle>
                <CardDescription className="text-muted-foreground">
                  View all customer orders
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
                        <TableHead className="text-foreground">User</TableHead>
                        <TableHead className="text-foreground">Car VIN</TableHead>
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
                          <TableCell className="font-mono text-xs text-foreground">
                            {order.userId.toString().slice(0, 10)}...
                          </TableCell>
                          <TableCell className="text-foreground">{order.carVin}</TableCell>
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
                  <p className="text-center py-8 text-muted-foreground">No orders yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Inventory Management</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage car availability status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inventoryLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-foreground">Model</TableHead>
                        <TableHead className="text-foreground">VIN</TableHead>
                        <TableHead className="text-foreground">Year</TableHead>
                        <TableHead className="text-foreground">Price</TableHead>
                        <TableHead className="text-foreground">Battery</TableHead>
                        <TableHead className="text-foreground">Available</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory?.map((car) => (
                        <TableRow key={car.vinNumber}>
                          <TableCell className="font-semibold text-foreground">{car.model}</TableCell>
                          <TableCell className="font-mono text-xs text-foreground">{car.vinNumber}</TableCell>
                          <TableCell className="text-foreground">{car.year}</TableCell>
                          <TableCell className="text-cyan font-semibold">
                            ${car.price.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-foreground">{car.batteryCapacity.toString()} kWh</TableCell>
                          <TableCell>
                            <Switch
                              checked={car.isForSale}
                              onCheckedChange={() => handleAvailabilityToggle(car.vinNumber, car.isForSale)}
                              disabled={setAvailability.isPending}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
