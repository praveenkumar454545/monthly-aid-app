"use client"

import { useState, useEffect } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { donors as initialDonors } from "@/lib/data"
  
  export function RecentDonations() {
    const [donations, setDonations] = useState<any[] | null>(null);

    useEffect(() => {
      // Process data on the client side to avoid hydration mismatch
      const allDonations = initialDonors.map(donor => ({
          ...donor,
          amount: donor.donations.reduce((acc, d) => acc + d.amount, 0)
      })).sort((a,b) => b.amount - a.amount);
      setDonations(allDonations);
    }, []);

    if (!donations) {
        // Render nothing on the server and initial client render to prevent hydration mismatch.
        return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>This Month's Donations</CardTitle>
          <CardDescription>
            {initialDonors.length} donations this month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {donations.map(donation => (
                <div key={donation.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://i.pravatar.cc/40?u=${donation.id}`} alt="Avatar" />
                        <AvatarFallback>{donation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{donation.name}</p>
                        <p className="text-sm text-muted-foreground">
                        {`+91...${donation.phone.slice(-4)}`}
                        </p>
                    </div>
                    <div className="ml-auto font-medium">+₹{donation.amount.toLocaleString()}</div>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
