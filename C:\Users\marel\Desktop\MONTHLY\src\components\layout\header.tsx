"use client";

import {
  HeartHandshake,
  Search,
  Info,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { UserProfile } from '@/components/user-profile';
import { MobileNav } from './mobile-nav';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AppHeader() {

    const handleScroll = (id: string) => {
        const mainContent = document.getElementById('main-content');
        const element = document.getElementById(id);
        if (element && mainContent) {
            mainContent.scrollTo({
                top: element.offsetTop - mainContent.offsetTop,
                behavior: 'smooth'
            });
        }
    }

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <HeartHandshake className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <MobileNav />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* The search form has been removed */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>About Us</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleScroll('our-mission')}>
                Our Mission
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScroll('our-goals')}>
                Our Goals
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScroll('our-team')}>
                Our Team
              </DropdownMenuItem>
               <DropdownMenuItem asChild>
                <a href="mailto:contact@monthlyaid.org">Contact Us</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserProfile />
        </header>
    )
}
