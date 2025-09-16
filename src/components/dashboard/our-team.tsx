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
import { teamMembers } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import type { TeamMember } from "@/lib/types"
import { Skeleton } from "../ui/skeleton"

function TeamMemberCard({ member }: { member: TeamMember }) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          {isClient ? (
            <>
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={member.avatarUrl || `https://i.pravatar.cc/150?u=${member.id}`} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                  <p className="text-lg font-semibold">{member.name}</p>
                  <p className="text-sm text-primary">{member.role}</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="text-center space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  )
}


export function OurTeam() {
  if(teamMembers.length === 0) {
    return null;
  }

  return (
    <Card id="our-team">
      <CardHeader>
        <CardTitle>Our Team</CardTitle>
        <CardDescription>
          The dedicated individuals working to make a difference.
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
            {teamMembers.map((member) => (
              <CarouselItem key={member.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <TeamMemberCard member={member} />
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
