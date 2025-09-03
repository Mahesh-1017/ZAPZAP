'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/AppContext';
import { Button } from './ui/button';

export default function CartIcon() {
  const { cartState } = useCart();
  const itemCount = cartState.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Button asChild variant="ghost" size="icon">
      <Link href="/cart" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
