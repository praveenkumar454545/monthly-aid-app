"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Beneficiary } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { Youtube } from 'lucide-react';

interface BeneficiaryListItemProps {
  beneficiary: Beneficiary;
}

export function BeneficiaryListItem({ beneficiary }: BeneficiaryListItemProps) {
  const amountRaised = beneficiary.donations.reduce((acc, d) => acc + d.amount, 0);
  const goal = 5000;
  const progress = Math.min((amountRaised / goal) * 100, 100);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="aspect-video relative w-full mb-4">
            <Image
                src={beneficiary.proofs[0]}
                alt={`Proof for ${beneficiary.name}`}
                fill
                className="rounded-md object-cover"
                data-ai-hint="family portrait"
            />
            {beneficiary.youtubeUrl && (
                <Link href={beneficiary.youtubeUrl} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors">
                    <Youtube className="h-5 w-5" />
                    <span className="sr-only">Watch on YouTube</span>
                </Link>
            )}
        </div>
        <CardTitle>{beneficiary.name}</CardTitle>
        <CardDescription className="line-clamp-3 h-[60px]">
          {beneficiary.summary || beneficiary.story}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {beneficiary.status !== 'FUNDED' && (
             <div className="space-y-2">
                <Progress value={progress} aria-label={`${progress}% funded`} />
                <div className="text-sm text-muted-foreground flex justify-between">
                    <span>Raised: <span className="font-bold text-foreground">₹{amountRaised.toLocaleString()}</span></span>
                    <span>Goal: ₹{goal.toLocaleString()}</span>
                </div>
            </div>
        )}
        {beneficiary.status === 'FUNDED' && (
            <div className="text-sm text-center text-green-600 font-semibold p-4 bg-green-50 rounded-md">
                Successfully Funded!
            </div>
        )}
       
      </CardContent>
      {beneficiary.status !== 'FUNDED' && (
        <CardFooter>
            <Button className="w-full">Donate Now</Button>
        </CardFooter>
      )}
    </Card>
  );
}
