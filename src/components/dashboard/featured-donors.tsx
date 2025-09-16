"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { donors } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import type { Donor } from "@/lib/types"

function DonorCard({ donor }: { donor: Donor }) {
  const [joinedDate, setJoinedDate] = React.useState<string>("");

  React.useEffect(() => {
    // This code now runs only on the client, after hydration.
    // This prevents a mismatch between server-rendered and client-rendered HTML.
    const date = new Date(donor.createdAt);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Using a consistent timezone for good measure
    }).format(date);
    setJoinedDate(formattedDate);
  }, [donor.createdAt]);

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={donor.avatarUrl || `https://i.pravatar.cc/150?u=${donor.id}`} alt={donor.name} />
              <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
              <p className="text-lg font-semibold">{donor.name}</p>
              {joinedDate && <p className="text-sm text-muted-foreground">Joined {joinedDate}</p>}
          </div>
      </CardContent>
    </Card>
  )
}


export function FeaturedDonors() {
  const featured = donors.filter(d => d.isFeatured)

  if(featured.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Month's Top Donors</CardTitle>
        <CardDescription>
          A heartfelt thank you to our most generous contributors this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featured.map((donor) => (
              <CarouselItem key={donor.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <DonorCard donor={donor} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  )
}
