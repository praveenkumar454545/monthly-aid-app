
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartHandshake,
  Home,
  LineChart,
  Award,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/beneficiaries", label: "Beneficiaries", icon: HeartHandshake },
    { href: "/results", label: "Results", icon: Award },
    { href: "/analytics", label: "Analytics", icon: LineChart },
  ];

  return (
    <nav className="grid gap-2 text-lg font-medium">
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        <Icons.logo className="h-6 w-6 text-primary" />
        <span className="sr-only">Monthly Aid</span>
      </Link>
      {navLinks.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
            pathname === href && "bg-muted text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
