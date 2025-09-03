'use client';

import Link from 'next/link';
import CartIcon from './CartIcon';
import { Button } from './ui/button';
import { useAuth } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function Header({
  showSearch = true,
  onSearch,
}: {
  showSearch?: boolean;
  onSearch?: (results: any[]) => void;
}) {
  const { logout, userEmail } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/products" className="text-2xl font-bold font-headline text-primary">
          ZAP-ZAP
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">{userEmail}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
