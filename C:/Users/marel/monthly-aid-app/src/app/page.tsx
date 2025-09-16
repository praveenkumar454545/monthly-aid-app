"use client";

import {
  HeartHandshake,
  Search,
  Users,
  Info,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { donors } from '@/lib/data';
import { FeaturedDonors } from '@/components/dashboard/featured-donors';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { UserProfile, useUser } from '@/components/user-profile';
import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { Badge } from '@/components/ui/badge';
import { recordDonation } from '@/ai/flows/record-donation-flow';
import { recordAnonymousDonation } from '@/ai/flows/record-anonymous-donation-flow';
import { Loader2 } from 'lucide-react';
import { AboutSection } from '@/components/about-section';
import { OurTeam } from '@/components/dashboard/our-team';
import { logDonation } from '@/ai/flows/log-donation-flow';


export default function Dashboard() {
  const { toast } = useToast();
  const { user } = useUser();
  
  const [donationAmount, setDonationAmount] = useState<number | string>("");
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [isDonating, setIsDonating] = useState(false);

  useEffect(() => {
    if (user) {
      setDonorName(user.name);
      setDonorPhone(user.phone);
    }
  }, [user]);

  const handlePresetDonation = (amount: number) => {
    setDonationAmount(amount);
  }

  const handleDonateNow = async () => {
    const amount = typeof donationAmount === 'string' ? parseFloat(donationAmount) : donationAmount;

    if (!amount || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a donation amount greater than zero.",
      });
      return;
    }
     if (!donorName || !donorPhone) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please enter your name and phone number to proceed with the donation.",
        });
        return;
    }


    setIsDonating(true);
    
    try {
      const result = await logDonation({
        name: donorName,
        phone: donorPhone,
        amount: amount,
        ...(user && { beneficiaryId: user.id })
      });

      toast({
        title: "Thank you for your contribution!",
        description: result.message,
      });

      // Reset form
      setDonationAmount("");
      if (!user) {
        setDonorName("");
        setDonorPhone("");
      }

    } catch (error: any) {
        console.error("Donation failed:", error);
        toast({
            variant: "destructive",
            title: "Donation Failed",
            description: error.message || "There was an error processing your donation. Please try again.",
        });
    } finally {
        setIsDonating(false);
    }
  }


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AppSidebar />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <AppHeader />
        <main id="main-content" className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          </div>
          <Tabs defaultValue="donate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="donate">Donate</TabsTrigger>
                <TabsTrigger value="village_admin" asChild>
                    <Link href="/village-admin/login">Village Admin</Link>
                </TabsTrigger>
                <TabsTrigger value="admin" asChild>
                    <Link href="/admin/login">Admin</Link>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="donate">
              <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                      <CardHeader>
                          <CardTitle>Contribute to this Month's Fund</CardTitle>
                          <CardDescription>
                              Your donation will help us support families in need. Your generosity will be published in the "Results" tab.
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="grid gap-2">
                             <Label>Select an amount</Label>
                            <div className="flex flex-wrap gap-2">
                              <Button variant={donationAmount === 500 ? "default" : "outline"} onClick={() => handlePresetDonation(500)}>₹500</Button>
                              <Button variant={donationAmount === 1000 ? "default" : "outline"} onClick={() => handlePresetDonation(1000)}>₹1000</Button>
                              <Button variant={donationAmount === 2500 ? "default" : "outline"} onClick={() => handlePresetDonation(2500)}>₹2500</Button>
                              <Button variant={donationAmount === 5000 ? "default" : "outline"} onClick={() => handlePresetDonation(5000)}>₹5000</Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="donor-name">Your Name</Label>
                                <Input id="donor-name" value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="e.g. Suresh Kumar" required disabled={isDonating}/>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="donor-phone">Phone Number</Label>
                                <Input id="donor-phone" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} placeholder="e.g. 9876543210" type="tel" required disabled={isDonating}/>
                              </div>
                          </div>
                          
                           {!user && (
                              <div className="text-sm text-center text-muted-foreground p-4 bg-muted rounded-md">
                                  Want to track your contributions? <Link href="/signup" className="underline font-semibold text-primary">Sign up</Link> to create an account.
                              </div>
                            )}

                           <div className="grid gap-2">
                              <Label htmlFor="custom-amount">Or Enter Custom Amount</Label>
                              <Input id="custom-amount" type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} placeholder="Enter amount" disabled={isDonating} />
                          </div>
                          <Button onClick={handleDonateNow} className="w-full" disabled={isDonating}>
                            {isDonating ? <Loader2 className="animate-spin" /> : 'Donate Now'}
                          </Button>
                          <p className="text-xs text-muted-foreground text-center pt-2">
                              This is a pledge. Real payment processing will be integrated soon.
                          </p>
                          <p className="text-xs text-muted-foreground text-center pt-2">
                              100% of your donation goes directly to the cause.
                          </p>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader>
                          <CardTitle>Our Family</CardTitle>
                          <CardDescription>
                              We are a growing community of generous members.
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center space-y-2">
                          <Users className="w-16 h-16 text-primary" />
                          <p className="text-4xl font-bold">{donors.length}</p>
                          <p className="text-muted-foreground">Members and counting!</p>
                      </CardContent>
                  </Card>
                </div>
                <FeaturedDonors />
                <AboutSection />
                <OurTeam />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
