'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, Home, Shield } from 'lucide-react';

export default function UserNav() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/signin">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/auth/signup">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  const userInitials = session.user.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : session.user.email?.[0].toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || ''} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
            {session.user.role !== 'USER' && (
              <p className="text-xs text-blue-600 font-medium mt-1">
                {session.user.role}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        
        {session.user.role === 'ADMIN' && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          className="cursor-pointer text-red-600"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}