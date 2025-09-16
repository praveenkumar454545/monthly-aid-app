
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from '@/components/user-profile';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Monthly Aid',
  description: 'A helping platform for monthly donations.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: "#42A5F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <UserProvider>
          {children}
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
