'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SearchInput from './SearchInput';
import UserNav from './UserNav';

export default function MainNav() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 lg:space-x-6">
          <Link href="/" className="text-xl font-bold">
            Rent2sell
          </Link>
          <Button
            asChild
            variant={isActive('/') ? "default" : "ghost"}
          >
            <Link href="/">
              Home
            </Link>
          </Button>
          <Button
            asChild
            variant={isActive('/rental-items') ? "default" : "ghost"}
          >
            <Link href="/rental-items">
              Items
            </Link>
          </Button>
        </div>

        <div className="mx-6 flex-1">
          <SearchInput />
        </div>

        <UserNav />
      </div>
    </nav>
  );
}