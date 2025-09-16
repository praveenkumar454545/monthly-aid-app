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
import { getAuth, onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { app } from '@/lib/firebase';

const auth = getAuth(app);

// Mock user data - in a real app, this would come from an auth context
const mockUser: User = {
    id: "user-123",
    name: "Suresh Kumar",
    phone: "9876543210",
    totalDonated: 600,
    createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
    avatarUrl: `https://i.pravatar.cc/40?u=user-123`
}

const UserContext = createContext<{ user: User | null }>({ user: null });

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // For demonstration, we'll merge the firebase user with mock data.
                // In a real app, you'd fetch the user profile from Firestore here.
                setUser({
                    ...mockUser,
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || mockUser.name,
                    phone: firebaseUser.phoneNumber || mockUser.phone,
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

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

  const handleLogout = async () => {
    await signOut(auth);
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
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
