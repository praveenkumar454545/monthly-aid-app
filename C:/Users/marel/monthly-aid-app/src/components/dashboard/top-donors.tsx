"use client"

import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { donors as initialDonors } from "@/lib/data"
import { Button } from '@/components/ui/button';
import { Star, StarOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Donor } from '@/lib/types';


export function TopDonors() {
    const [donors, setDonors] = useState<Donor[]>(initialDonors);
    const { toast } = useToast();

    const sortedDonors = [...donors]
        .sort((a, b) => b.donations.reduce((acc, d) => acc + d.amount, 0) - a.donations.reduce((acc, d) => acc + d.amount, 0))
        .map(donor => ({
            ...donor,
            totalDonated: donor.donations.reduce((acc, d) => acc + d.amount, 0)
        }));

    const handleFeatureToggle = (donorId: number) => {
        setDonors(donors.map(donor => {
            if (donor.id === donorId) {
                const isFeatured = !donor.isFeatured;
                toast({
                    title: isFeatured ? "Donor Featured" : "Donor Unfeatured",
                    description: `${donor.name} will now ${isFeatured ? 'appear on' : 'be hidden from'} the homepage carousel.`
                });
                return { ...donor, isFeatured };
            }
            return donor;
        }));
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Donor Management</CardTitle>
        <CardDescription>
            Manage which donors are featured on the homepage carousel. The list is sorted from highest to lowest donation.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {sortedDonors.map(donor => (
             <div key={donor.id} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={donor.avatarUrl || `https://i.pravatar.cc/40?u=${donor.id}`} alt="Avatar" />
                    <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">{donor.name}</p>
                    <p className="text-sm text-muted-foreground">{`+91...${donor.phone.slice(-4)}`}</p>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <div className="font-medium">₹{donor.totalDonated.toLocaleString()}</div>
                    <Button
                        variant={donor.isFeatured ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFeatureToggle(donor.id)}
                    >
                        {donor.isFeatured ? <StarOff className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
                        {donor.isFeatured ? 'Unfeature' : 'Feature'}
                    </Button>
                </div>
            </div>
        ))}
      </CardContent>
    </Card>
  )
}
