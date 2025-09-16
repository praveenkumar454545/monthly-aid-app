
"use client";

import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BeneficiaryListItem } from '@/components/dashboard/beneficiary-list-item';
import { beneficiaries as initialBeneficiaries, monthlyDonations } from '@/lib/data';
import type { Beneficiary, MonthlyDonation } from '@/lib/types';
import { AppHeader } from '@/components/layout/header';
import { AppSidebar } from '@/components/layout/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

interface MonthlyResult extends MonthlyDonation {
    beneficiaries: Beneficiary[];
}

export default function ResultsPage() {
    const [beneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
    const [monthlyResults, setMonthlyResults] = useState<MonthlyResult[]>([]);
    const [loading, setLoading] = useState(true);

    const monthNameToNumber: { [key: string]: number } = {
        "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5, 
        "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
    };

    useEffect(() => {
        const donationResults = monthlyDonations.slice().reverse(); // Latest month first

        const results = donationResults.map(month => {
            const monthNumber = monthNameToNumber[month.name.split(' ')[0]];
            const yearNumber = parseInt(month.name.split(' ')[1], 10);

            const monthBeneficiaries = beneficiaries.filter(
                (b) => {
                    if (!b.createdAt) return false;
                    const benDate = new Date(b.createdAt);
                    return benDate.getUTCFullYear() === yearNumber &&
                           benDate.getUTCMonth() === monthNumber &&
                           b.status === "FUNDED";
                }
            );
            
            const calculatedTotal = monthBeneficiaries.reduce((acc, ben) => {
                return acc + ben.donations.reduce((dAcc, donation) => dAcc + donation.amount, 0);
            }, 0);
            
            const displayTotal = calculatedTotal > 0 ? calculatedTotal : month.total;

            return {
                ...month,
                total: displayTotal,
                beneficiaries: monthBeneficiaries
            };
        }).filter(month => month.beneficiaries.length > 0 || month.total > 0);

        setMonthlyResults(results);
        setLoading(false);
    }, [beneficiaries]);


    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <AppSidebar />
            <div className="flex flex-col">
                <AppHeader />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    <div className="flex items-center">
                        <h1 className="text-lg font-semibold md:text-2xl">Results</h1>
                    </div>
                     {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    ) : (
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {monthlyResults.map((month) => (
                                <AccordionItem value={month.name} key={month.name} className="border-b-0 rounded-lg bg-card shadow-sm">
                                    <AccordionTrigger className="p-6 hover:no-underline">
                                        <div className="flex flex-col text-left">
                                            <h3 className="text-lg font-semibold">{month.name} Results</h3>
                                            <p className="text-sm text-muted-foreground">Total Raised: <span className="font-bold text-foreground">₹{month.total.toLocaleString()}</span></p>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-6 pt-0">
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {month.beneficiaries.length > 0 ? month.beneficiaries.map(beneficiary => (
                                            <BeneficiaryListItem
                                                key={beneficiary.id}
                                                beneficiary={beneficiary}
                                            />
                                            )) : (
                                                <div className="col-span-full text-center py-4">
                                                    <p className="text-muted-foreground">Details for this month are being compiled and will be updated soon.</p>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </main>
            </div>
        </div>
    );
}

