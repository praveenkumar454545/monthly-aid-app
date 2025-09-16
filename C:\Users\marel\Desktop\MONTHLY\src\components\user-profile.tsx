
"use client"

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { CircleUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

// Mock user data for static site
const mockUser: User = {
    id: "user-123",
    name: "Suresh Kumar",
    phone: "9876543210",
    totalDonated: 600,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    avatarUrl: `https://i.pravatar.cc/40?u=user-123`
}

const UserContext = createContext<{ user: User | null }>({ user: null });

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
    // For static export, we set the user to null initially.
    // A real app would use Firebase Auth state.
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
}


export function UserProfile() {
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial client render.
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    // In a static site, we can't truly log out from a backend,
    // but we can simulate it by refreshing or redirecting.
    console.log("Simulating logout.");
    window.location.href = "/"; // Redirect to home
  }
  
  if (!isClient) {
    // Render a skeleton or a placeholder on the server and during the initial client render
    // to avoid hydration mismatch.
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          {user && user.avatarUrl ? (
             <img src={user.avatarUrl} alt={user.name} className="rounded-full h-8 w-8 object-cover" />
          ) : (
            <CircleUser className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user ? (
          <>
            <DropdownMenuLabel>
                <div>My Account</div>
                <div className="font-normal text-xs text-muted-foreground">{user.name}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between font-medium">
              <span>Total Donated:</span>
              <span>₹{user.totalDonated.toLocaleString()}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </>
        ) : (
           <>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/signup">Sign Up</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href="/admin/login">Admin Login</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href="/village-admin/login">Village Admin Login</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
