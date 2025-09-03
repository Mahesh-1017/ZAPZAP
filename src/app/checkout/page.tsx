'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useCart } from '@/context/AppContext';
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
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cartState, dispatch } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const subtotal = cartState.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (cartState.items.length === 0) {
    router.replace('/products');
    return null;
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a mock checkout
    console.log('Processing payment...');
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: 'Order Successful!',
      description: 'Thank you for your purchase. Your items are on their way.',
    });
    router.push('/products');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-headline mb-8 text-center">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>
                  Enter your address to receive your order.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Gym Street" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Fitnessville" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="12345" required />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-4">
                  {cartState.items.map(({ product, quantity }) => (
                    <li key={product.id} className="flex justify-between items-center text-sm">
                      <span>{product.name} x {quantity}</span>
                      <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button form="checkout-form" type="submit" className="w-full mt-6" size="lg">
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
